<?php
include_once('./API/config.php');
// Get the slug from query string
$slug = $_GET['slug'] ?? '';

// If no slug, check for 'name' parameter (from apparel_detail.php?name=...)
if (empty($slug) && isset($_GET['name'])) {
    $slug = $_GET['name'];
}

// Extract slug from full URL if needed
if (strpos($slug, 'http') === 0) {
    // Parse the URL
    $parsedUrl = parse_url($slug);
    $path = $parsedUrl['path'] ?? '';
    
    // Extract the last part of the path (after last /)
    $pathParts = explode('/', trim($path, '/'));
    $slug = end($pathParts);
}

// Remove query parameters (e.g., &days=3)
if (strpos($slug, '&') !== false) {
    $slug = explode('&', $slug)[0];
}

if (empty($slug)) {
    header('Location: https://srishringarr.com/', true, 301);
    exit;
}

// Convert slug to product name
// Step 1: Remove common prefixes like "Rent", "Buy", etc.
$productName = preg_replace('/^(Rent|Buy|Shop)_/i', '', $slug);

// Step 2: Remove trailing numbers/SKU (e.g., _1, _123, etc.)
$productName = preg_replace('/_\d+$/', '', $productName);

// Step 3: Replace underscores with spaces
$productName = str_replace('_', ' ', $productName);

// Step 4: Normalize common word variations
$productName = str_replace('IndoWestern', 'Indo-Western', $productName);
$productName = str_replace('Indowestern', 'Indo-Western', $productName);
$productName = str_replace('indo western', 'Indo-Western', $productName);

// Step 5: Clean up extra spaces
$productName = preg_replace('/\s+/', ' ', $productName);
$productName = trim($productName);

/**
 * Try to find product with fallback strategy
 * 1. Try exact match
 * 2. Try fuzzy match (removing special characters)
 * 3. Try partial match (removing first/last words)
 * 4. Try searching by SKU (last part after underscore)
 */
function findProduct($searchName, $con) {
    $searchName = mysqli_real_escape_string($con, $searchName);
    
    // Strategy 1: Try exact match in jewellery products
    $query = "SELECT product_id as id, product_name as name FROM product WHERE product_name LIKE '%$searchName%' LIMIT 1";
    $result = mysqli_query($con, $query);
    
    if ($result && mysqli_num_rows($result) > 0) {
        $product = mysqli_fetch_assoc($result);
        return [
            'id' => $product['id'],
            'name' => $product['name'],
            'type' => 'jewellery'
        ];
    }
    
    // Strategy 2: Try exact match in garment products
    $query = "SELECT gproduct_id as id, gproduct_name as name FROM garment_product WHERE gproduct_name LIKE '%$searchName%' LIMIT 1";
    $result = mysqli_query($con, $query);
    
    if ($result && mysqli_num_rows($result) > 0) {
        $product = mysqli_fetch_assoc($result);
        return [
            'id' => $product['id'],
            'name' => $product['name'],
            'type' => 'garment'
        ];
    }
    
    // Strategy 3: Try fuzzy match - remove hyphens, commas and special chars from both search and DB
    $fuzzyName = str_replace(['-', '_', '.', ','], ' ', $searchName);
    $fuzzyName = preg_replace('/\s+/', ' ', $fuzzyName);
    $fuzzyName = trim($fuzzyName);
    $fuzzyName = mysqli_real_escape_string($con, $fuzzyName);
    
    // Always try fuzzy match (not just when fuzzyName differs from searchName)
    // Try jewellery with fuzzy match - normalize both sides
    $query = "SELECT product_id as id, product_name as name FROM product 
              WHERE REPLACE(REPLACE(REPLACE(REPLACE(product_name, '-', ' '), '_', ' '), ',', ' '), '  ', ' ') LIKE '%$fuzzyName%' LIMIT 1";
    $result = mysqli_query($con, $query);
    
    if ($result && mysqli_num_rows($result) > 0) {
        $product = mysqli_fetch_assoc($result);
        return [
            'id' => $product['id'],
            'name' => $product['name'],
            'type' => 'jewellery'
        ];
    }
    
    // Try garment with fuzzy match - normalize both sides
    $query = "SELECT gproduct_id as id, gproduct_name as name FROM garment_product 
              WHERE REPLACE(REPLACE(REPLACE(REPLACE(gproduct_name, '-', ' '), '_', ' '), ',', ' '), '  ', ' ') LIKE '%$fuzzyName%' LIMIT 1";
    $result = mysqli_query($con, $query);
    
    if ($result && mysqli_num_rows($result) > 0) {
        $product = mysqli_fetch_assoc($result);
        return [
            'id' => $product['id'],
            'name' => $product['name'],
            'type' => 'garment'
        ];
    }
    
    return null;
}

function findProductBySKU($sku, $con) {
    $sku = mysqli_real_escape_string($con, $sku);
    
    // Try jewellery products by SKU
    $query = "SELECT product_id as id, product_name as name FROM product WHERE product_code = '$sku' LIMIT 1";
    $result = mysqli_query($con, $query);
    
    if ($result && mysqli_num_rows($result) > 0) {
        $product = mysqli_fetch_assoc($result);
        return [
            'id' => $product['id'],
            'name' => $product['name'],
            'type' => 'jewellery'
        ];
    }
    
    // Try garment products by SKU
    $query = "SELECT gproduct_id as id, gproduct_name as name FROM garment_product WHERE gproduct_code = '$sku' LIMIT 1";
    $result = mysqli_query($con, $query);
    
    if ($result && mysqli_num_rows($result) > 0) {
        $product = mysqli_fetch_assoc($result);
        return [
            'id' => $product['id'],
            'name' => $product['name'],
            'type' => 'garment'
        ];
    }
    
    return null;
}

// Try to find product with original name
$product = findProduct($productName, $con);


// var_dump($product);
// return ; 
// If not found, try removing the first word and search again
if (!$product) {
    $words = explode(' ', $productName);
    if (count($words) > 1) {
        // Remove first word
        array_shift($words);
        $modifiedName = implode(' ', $words);
        $product = findProduct($modifiedName, $con);
    }
}

// If still not found, try extracting SKU from the end (usually after last underscore)
if (!$product) {
    // Check if there's a SKU pattern at the end (e.g., EAR789ON)
    $parts = explode('_', $slug);
    $lastPart = end($parts);
    
    // If last part looks like a SKU (alphanumeric, 5+ chars)
    if (preg_match('/^[A-Z0-9]{5,}$/i', $lastPart)) {
        $product = findProductBySKU($lastPart, $con);
    }
}

// If still not found, redirect to shop page
if (!$product) {
    header('Location: https://srishringarr.com/shop', true, 301);
    exit;
}

// Generate new URL slug
$newSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $product['name'])));
$newUrl = "https://srishringarr.com/product/$newSlug-{$product['id']}";

// 301 permanent redirect to new URL
header("Location: $newUrl", true, 301);
exit;
?>
