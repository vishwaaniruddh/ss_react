<?php
/**
 * Dynamic Products Sitemap Generator
 * 
 * Generates sitemap with all product URLs from the database
 */

// Find config.php
$configPaths = [
    __DIR__ . '/../../API/config.php',
    __DIR__ . '/../API/config.php',
    dirname(dirname(__DIR__)) . '/API/config.php',
];

$configLoaded = false;
foreach ($configPaths as $configPath) {
    if (file_exists($configPath)) {
        require_once $configPath;
        $configLoaded = true;
        break;
    }
}

if (!$configLoaded) {
    header('HTTP/1.1 500 Internal Server Error');
    die('Configuration not found');
}

// Set XML header
header('Content-Type: application/xml; charset=utf-8');

// Start XML output
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

/**
 * Generate product URL slug
 */
function generateSlug($name) {
    return strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
}

// Fetch all jewellery products
$jewelQuery = "SELECT product_id as id, product_name as name FROM product WHERE 1 ORDER BY id DESC";
$jewelResult = mysqli_query($con, $jewelQuery);

if ($jewelResult) {
    while ($product = mysqli_fetch_assoc($jewelResult)) {
        $slug = generateSlug($product['name']);
        $url = "https://srishringarr.com/product/$slug-{$product['id']}";
        $lastmod = date('Y-m-d'); // Use current date since updated_at column doesn't exist
        
        echo "  <url>\n";
        echo "    <loc>" . htmlspecialchars($url) . "</loc>\n";
        echo "    <lastmod>$lastmod</lastmod>\n";
        echo "    <changefreq>weekly</changefreq>\n";
        echo "    <priority>0.8</priority>\n";
        echo "  </url>\n";
    }
}

// Fetch all garment products
$garmentQuery = "SELECT gproduct_id as id, gproduct_name as name FROM garment_product WHERE 1 ORDER BY id DESC";
$garmentResult = mysqli_query($con, $garmentQuery);

if ($garmentResult) {
    while ($product = mysqli_fetch_assoc($garmentResult)) {
        $slug = generateSlug($product['name']);
        $url = "https://srishringarr.com/product/$slug-{$product['id']}";
        $lastmod = date('Y-m-d'); // Use current date since updated_at column doesn't exist
        
        echo "  <url>\n";
        echo "    <loc>" . htmlspecialchars($url) . "</loc>\n";
        echo "    <lastmod>$lastmod</lastmod>\n";
        echo "    <changefreq>weekly</changefreq>\n";
        echo "    <priority>0.8</priority>\n";
        echo "  </url>\n";
    }
}

echo '</urlset>';

mysqli_close($con);
?>
