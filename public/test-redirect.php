<?php
include_once('../../API/config.php');

$searchName = 'Gorgeous yellow lime green and golden lehenga set';

echo "<h3>Testing Product Search</h3>";
echo "Search term: <strong>$searchName</strong><br/><br/>";

// Test 1: Exact match
echo "<h4>Test 1: Exact Match</h4>";
$query = "SELECT gproduct_id as id, gproduct_name as name FROM garment_product WHERE gproduct_name LIKE '%$searchName%' LIMIT 1";
echo "Query: $query<br/>";
$result = mysqli_query($con, $query);
if ($result && mysqli_num_rows($result) > 0) {
    $product = mysqli_fetch_assoc($result);
    echo "✅ Found: {$product['name']} (ID: {$product['id']})<br/>";
} else {
    echo "❌ Not found<br/>";
}

// Test 2: Fuzzy match
echo "<br/><h4>Test 2: Fuzzy Match (removing commas from DB)</h4>";
$fuzzyName = str_replace(['-', '_', '.', ','], ' ', $searchName);
$fuzzyName = preg_replace('/\s+/', ' ', $fuzzyName);
$fuzzyName = trim($fuzzyName);
echo "Fuzzy search term: <strong>$fuzzyName</strong><br/>";

$query = "SELECT gproduct_id as id, gproduct_name as name FROM garment_product 
          WHERE REPLACE(REPLACE(REPLACE(REPLACE(gproduct_name, '-', ' '), '_', ' '), ',', ' '), '  ', ' ') LIKE '%$fuzzyName%' LIMIT 1";
echo "Query: $query<br/>";
$result = mysqli_query($con, $query);
if ($result && mysqli_num_rows($result) > 0) {
    $product = mysqli_fetch_assoc($result);
    echo "✅ Found: {$product['name']} (ID: {$product['id']})<br/>";
} else {
    echo "❌ Not found<br/>";
}

// Test 3: Show what the actual product name looks like in DB
echo "<br/><h4>Test 3: Find products with 'Gorgeous' in name</h4>";
$query = "SELECT gproduct_id as id, gproduct_name as name FROM garment_product WHERE gproduct_name LIKE '%Gorgeous%' LIMIT 5";
echo "Query: $query<br/>";
$result = mysqli_query($con, $query);
if ($result && mysqli_num_rows($result) > 0) {
    echo "<ul>";
    while ($product = mysqli_fetch_assoc($result)) {
        echo "<li>{$product['name']} (ID: {$product['id']})</li>";
    }
    echo "</ul>";
} else {
    echo "❌ No products found with 'Gorgeous'<br/>";
}

// Test 4: Show what the normalized DB value looks like
echo "<br/><h4>Test 4: Show normalized product names</h4>";
$query = "SELECT gproduct_id as id, gproduct_name as name, 
          REPLACE(REPLACE(REPLACE(REPLACE(gproduct_name, '-', ' '), '_', ' '), ',', ' '), '  ', ' ') as normalized
          FROM garment_product WHERE gproduct_name LIKE '%Gorgeous%' LIMIT 5";
echo "Query: $query<br/>";
$result = mysqli_query($con, $query);
if ($result && mysqli_num_rows($result) > 0) {
    echo "<table border='1' cellpadding='5'>";
    echo "<tr><th>ID</th><th>Original Name</th><th>Normalized Name</th></tr>";
    while ($product = mysqli_fetch_assoc($result)) {
        echo "<tr>";
        echo "<td>{$product['id']}</td>";
        echo "<td>{$product['name']}</td>";
        echo "<td>{$product['normalized']}</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "❌ No products found<br/>";
}
?>
