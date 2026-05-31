<?php

// $configPaths = [
//      '../../API/config.php',  // Development: client/public/redirect.php -> API/config.php
//     __DIR__ . '/../API/config.php',     // Production: dist/redirect.php -> API/config.php
//     dirname(dirname(__DIR__)) . '/API/config.php', // Alternative path
// ];

include_once('../../API/config.php');

// Test with full URL
$slug = 'https://www.srishringarr.com/apparel/Rent_Blue_Grey_Gaurav_Gupta_Inspired_IndoWestern_Outfit_1&days=3';

// Extract slug from full URL if needed
if (strpos($slug, 'http') === 0) {
    // Parse the URL
    $parsedUrl = parse_url($slug);
    $path = $parsedUrl['path'] ?? '';
    
    // Extract the last part of the path (after last /)
    $pathParts = explode('/', trim($path, '/'));
    $slug = end($pathParts);
    
    echo "Extracted slug from URL: '$slug'<br/>";
}

// Remove query parameters (e.g., &days=3)
if (strpos($slug, '&') !== false) {
    $slug = explode('&', $slug)[0];
    echo "Removed query params: '$slug'<br/>";
}

// $slug = 'Rent_Blue_Grey_Gaurav_Gupta_Inspired_IndoWestern_Outfit_1';
// $slug = 'Rent_Light_pink_coloured_floor_length_gown_with_sea_green_dupatta_and_hand_embroidered_butti_work_with_wide_border&days=3';
// $slug = 'Rent_Purple_ombre_crop_top_styled_indowestern_outfit';
// Purple ombre crop top styled indo-western outfit.
// Get the slug from query string
// $slug = $_GET['slug'] ?? '';

if (empty($slug)) {
    echo "Empty slug, redirecting to home<br/>";
    header('Location: /', true, 301);
    exit;
}

echo "Processing slug: '$slug'<br/><br/>";

// echo $slug ; 
// Convert slug to product name
echo "<strong>Step 1: Slug Conversion</strong><br/>";
echo "Original slug: '$slug'<br/>";

// Step 1: Remove common prefixes like "Rent", "Buy", etc.
$productName = preg_replace('/^(Rent|Buy|Shop)_/i', '', $slug);
echo "After removing prefix: '$productName'<br/>";

// Step 2: Remove trailing numbers/SKU (e.g., _1, _123, etc.)
$productName = preg_replace('/_\d+$/', '', $productName);
echo "After removing trailing numbers: '$productName'<br/>";

// Step 3: Replace underscores with spaces
$productName = str_replace('_', ' ', $productName);
echo "After replacing underscores: '$productName'<br/>";

// Step 4: Normalize common word variations
$productName = str_replace('IndoWestern', 'Indo-Western', $productName);
$productName = str_replace('Indowestern', 'Indo-Western', $productName);
$productName = str_replace('indo western', 'Indo-Western', $productName);
echo "After normalizing variations: '$productName'<br/>";

// Step 5: Clean up extra spaces
$productName = preg_replace('/\s+/', ' ', $productName);
$productName = trim($productName);
echo "Final product name: '$productName'<br/><br/>";


//  echo 'hi';
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
    echo "Searching for: '$searchName'<br/>";
    $query = "SELECT product_id as id, product_name as name FROM product WHERE product_name LIKE '%$searchName%' LIMIT 1";
    echo "Query: $query<br/>";
    $result = mysqli_query($con, $query);
    
    if ($result && mysqli_num_rows($result) > 0) {
        $product = mysqli_fetch_assoc($result);
        echo "Found in product table!<br/>";
        return [
            'id' => $product['id'],
            'name' => $product['name'],
            'type' => 'jewellery'
        ];
    }
    
    // Strategy 2: Try exact match in garment products
    $query = "SELECT gproduct_id as id, gproduct_name as name FROM garment_product WHERE gproduct_name LIKE '%$searchName%' LIMIT 1";
    echo "Query: $query<br/>";
    $result = mysqli_query($con, $query);
    
    if ($result && mysqli_num_rows($result) > 0) {
        $product = mysqli_fetch_assoc($result);
        echo "Found in garment_product table!<br/>";
        return [
            'id' => $product['id'],
            'name' => $product['name'],
            'type' => 'garment'
        ];
    }
    
    // Strategy 3: Try fuzzy match - remove hyphens and special chars
    $fuzzyName = str_replace(['-', '_', '.', ','], ' ', $searchName);
    $fuzzyName = preg_replace('/\s+/', ' ', $fuzzyName);
    $fuzzyName = mysqli_real_escape_string($con, $fuzzyName);
    
    if ($fuzzyName !== $searchName) {
        echo "Trying fuzzy match: '$fuzzyName'<br/>";
        
        // Try jewellery with fuzzy match
        $query = "SELECT product_id as id, product_name as name FROM product WHERE REPLACE(REPLACE(REPLACE(product_name, '-', ' '), '_', ' '), '  ', ' ') LIKE '%$fuzzyName%' LIMIT 1";
        $result = mysqli_query($con, $query);
        
        if ($result && mysqli_num_rows($result) > 0) {
            $product = mysqli_fetch_assoc($result);
            echo "Found with fuzzy match in product table!<br/>";
            return [
                'id' => $product['id'],
                'name' => $product['name'],
                'type' => 'jewellery'
            ];
        }
        
        // Try garment with fuzzy match
        $query = "SELECT gproduct_id as id, gproduct_name as name FROM garment_product WHERE REPLACE(REPLACE(REPLACE(gproduct_name, '-', ' '), '_', ' '), '  ', ' ') LIKE '%$fuzzyName%' LIMIT 1";
        $result = mysqli_query($con, $query);
        
        if ($result && mysqli_num_rows($result) > 0) {
            $product = mysqli_fetch_assoc($result);
            echo "Found with fuzzy match in garment_product table!<br/>";
            return [
                'id' => $product['id'],
                'name' => $product['name'],
                'type' => 'garment'
            ];
        }
    }
    
    echo "No match found<br/>";
    return null;
}

function findProductBySKU($sku, $con) {
    echo "Searching by SKU: '$sku'<br/>";
    $sku = mysqli_real_escape_string($con, $sku);
    
    // Try jewellery products by SKU
    $query = "SELECT product_id as id, product_name as name FROM product WHERE product_code = '$sku' LIMIT 1";
    echo "Query: $query<br/>";
    $result = mysqli_query($con, $query);
    
    if ($result && mysqli_num_rows($result) > 0) {
        $product = mysqli_fetch_assoc($result);
        echo "Found by SKU in product table!<br/>";
        return [
            'id' => $product['id'],
            'name' => $product['name'],
            'type' => 'jewellery'
        ];
    }
    
    // Try garment products by SKU
    $query = "SELECT gproduct_id as id, gproduct_name as name FROM garment_product WHERE gproduct_code = '$sku' LIMIT 1";
    echo "Query: $query<br/>";
    $result = mysqli_query($con, $query);
    
    if ($result && mysqli_num_rows($result) > 0) {
        $product = mysqli_fetch_assoc($result);
        echo "Found by SKU in garment_product table!<br/>";
        return [
            'id' => $product['id'],
            'name' => $product['name'],
            'type' => 'garment'
        ];
    }
    
    echo "No SKU match found<br/>";
    return null;
}

// Try to find product with original name
echo "<strong>Step 2: Product Search</strong><br/>";
$product = findProduct($productName, $con);
echo "<br/>";

// var_dump($product);

// return ; 


// If not found, try removing the first word and search again
if (!$product) {
    echo "<strong>Step 3: Trying without first word</strong><br/>";
    $words = explode(' ', $productName);
    if (count($words) > 1) {
        // Remove first word
        array_shift($words);
        $modifiedName = implode(' ', $words);
        echo "Modified name: '$modifiedName'<br/>";
        $product = findProduct($modifiedName, $con);
        echo "<br/>";
    }
}

// If still not found, try extracting SKU from the end (usually after last underscore)
if (!$product) {
    echo "<strong>Step 4: Trying SKU search</strong><br/>";
    // Check if there's a SKU pattern at the end (e.g., EAR789ON)
    $parts = explode('_', $slug);
    $lastPart = end($parts);
    
    echo "Last part of slug: '$lastPart'<br/>";
    
    // If last part looks like a SKU (alphanumeric, 5+ chars)
    if (preg_match('/^[A-Z0-9]{5,}$/i', $lastPart)) {
        $product = findProductBySKU($lastPart, $con);
    } else {
        echo "Last part doesn't look like a SKU<br/>";
    }
    echo "<br/>";
}

// If still not found, redirect to shop page
if (!$product) {
    echo "<strong>Result: Product not found, redirecting to /shop</strong><br/>";
    // Uncomment below for actual redirect
    // header('Location: /shop', true, 301);
    // exit;
} else {
    echo "<strong>Step 5: Generate New URL</strong><br/>";
    echo "Product found: {$product['name']} (ID: {$product['id']}, Type: {$product['type']})<br/>";
    
    // Generate new URL slug
    $newSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $product['name'])));
    $newUrl = "https://srishringarr.com/product/$newSlug-{$product['id']}";
    
    echo "<br/><strong>Final Result:</strong><br/>";
    echo "New URL: <a href='$newUrl' target='_blank'>$newUrl</a><br/>";
    
    // Uncomment below for actual redirect
    // header("Location: $newUrl", true, 301);
    // exit;
}
?>
