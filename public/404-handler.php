<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/**
 * 404 Handler for SPA
 * This file checks if a route should return 404 status
 * while still serving the React app
 */

// List of valid React routes (update this as routes change)
$validRoutes = [
    '/',
    '/shop',
    '/product',
    '/bridal',
    '/jewellery',
    '/collections',
    '/about',
    '/contact',
    '/terms',
    '/faq',
    '/how-it-works',
    '/client-diary',
    '/testimonials',
    '/wishlist',
    '/cart',
    '/checkout',
    '/login',
    '/register',
    '/auth',
    '/account',
];

// Get the requested URI
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestUri = rtrim($requestUri, '/');
if (empty($requestUri)) {
    $requestUri = '/';
}

// Check if it's a valid route or starts with a valid route
$isValidRoute = false;
foreach ($validRoutes as $route) {
    if ($requestUri === $route || strpos($requestUri, $route . '/') === 0) {
        $isValidRoute = true;
        break;
    }
}

// If not a valid route, set 404 status
if (!$isValidRoute) {
    http_response_code(404);
    header('X-Robots-Tag: noindex');
}

// Parse the requested URI path
$ogData = null;
if (preg_match('#^/product/.*-([0-9]+)$#', $requestUri, $matches)) {
    $productId = (int)$matches[1];
    
    // Locate and load API config to get database connection ($con)
    $configPaths = [
        './API/config.php',
        __DIR__ . '/../API/config.php',
        __DIR__ . '/../../API/config.php',
        dirname(dirname(__DIR__)) . '/API/config.php',
    ];
    
    $configLoaded = false;
    foreach ($configPaths as $configPath) {
        if (file_exists($configPath)) {
            // Suppress headers already sent warnings from session_start() in config.php
            @require_once $configPath;
            $configLoaded = true;
            break;
        }
    }
    
    if ($configLoaded && isset($con) && $productId > 0) {
        mysqli_set_charset($con, 'utf8mb4');
        $productName = '';
        $productDesc = '';
        $imageName = '';
        $type = 'jewellery';
        
        // 1. Check if it's a Jewellery item
        $q = "SELECT product_name AS name, product_desc AS description, product_image AS image FROM product WHERE product_id = $productId LIMIT 1";
        $r = mysqli_query($con, $q);
        if ($r && mysqli_num_rows($r) > 0) {
            $row = mysqli_fetch_assoc($r);
            $productName = $row['name'];
            $productDesc = $row['description'];
            $imageName = $row['image'];
            $type = 'jewellery';
        } else {
            // 2. Check if it's a Garment item
            $q = "SELECT gproduct_name AS name, gproduct_desc AS description, gproduct_image AS image FROM garment_product WHERE gproduct_id = $productId LIMIT 1";
            $r = mysqli_query($con, $q);
            if ($r && mysqli_num_rows($r) > 0) {
                $row = mysqli_fetch_assoc($r);
                $productName = $row['name'];
                $productDesc = $row['description'];
                $imageName = $row['image'];
                $type = 'garments';
            }
        }
        
        if (!empty($productName)) {
            // Check images table for high-res main image, fallback to product_image
            $imgField = ($type === 'jewellery') ? 'product_id' : 'gproduct_id';
            $imgQ = "SELECT img_name FROM product_images_new WHERE $imgField = $productId ORDER BY rank ASC LIMIT 1";
            $imgR = mysqli_query($con, $imgQ);
            if ($imgR && mysqli_num_rows($imgR) > 0) {
                $imgRow = mysqli_fetch_assoc($imgR);
                if (!empty($imgRow['img_name'])) {
                    $imageName = $imgRow['img_name'];
                }
            }
            
            // Format Image URL
            $imageUrl = '';
            if (!empty($imageName)) {
                $cleanImageName = ltrim(str_replace(['../../yn/uploads', '../yn/uploads', '/yn/uploads'], '', $imageName), '/');
                $imageUrl = "https://srishringarr.com/yn/uploads/" . $cleanImageName;
            } else {
                $imageUrl = "https://srishringarr.com/logo-transparent.png";
            }
            
            // Clean Description (strip HTML, max 200 chars)
            $cleanDesc = trim(strip_tags($productDesc));
            $cleanDesc = preg_replace('/\s+/', ' ', $cleanDesc);
            if (strlen($cleanDesc) > 200) {
                $cleanDesc = substr($cleanDesc, 0, 197) . '...';
            }
            
            $ogData = [
                'title' => htmlspecialchars($productName),
                'description' => htmlspecialchars($cleanDesc),
                'image' => htmlspecialchars($imageUrl),
                'url' => htmlspecialchars("https://srishringarr.com" . $_SERVER['REQUEST_URI'])
            ];
        }
    }
}

// Serve the React app with Dynamic Metadata
$indexPath = __DIR__ . '/index.html';
if (!file_exists($indexPath)) {
    die("Error: index.html does not exist in directory " . __DIR__ . ". Please ensure you have run 'npm run build' and uploaded the built files.");
}
if (!is_readable($indexPath)) {
    die("Error: index.html is not readable in " . __DIR__ . ". Please check file permissions. Current permissions: " . substr(sprintf('%o', fileperms($indexPath)), -4));
}

$html = file_get_contents($indexPath);
if ($html === false) {
    die("Error reading index.html");
}

// Set Meta Tag Values
$title = "Sri Shringarr — Luxury Indian Bridal Jewellery & Apparels";
$description = "Rent designer bridal jewellery, lehenga cholis, sarees, and gowns at affordable prices. Look stunning on your special day with Sri Shringarr.";
$imageUrl = "https://srishringarr.com/logo-transparent.png";
$pageUrl = "https://srishringarr.com" . $_SERVER['REQUEST_URI'];
$pageType = "website";

if ($ogData) {
    $title = $ogData['title'];
    $description = $ogData['description'];
    $imageUrl = $ogData['image'];
    $pageUrl = $ogData['url'];
    $pageType = "product";
}

// Build Open Graph Meta Tags Block
$ogMetaTags = "\n    <!-- Dynamic Open Graph Meta Tags -->\n" .
              "    <title>" . $title . "</title>\n" .
              "    <meta name=\"description\" content=\"" . $description . "\" />\n" .
              "    <meta property=\"og:title\" content=\"" . $title . "\" />\n" .
              "    <meta property=\"og:description\" content=\"" . $description . "\" />\n" .
              "    <meta property=\"og:image\" content=\"" . $imageUrl . "\" />\n" .
              "    <meta property=\"og:url\" content=\"" . $pageUrl . "\" />\n" .
              "    <meta property=\"og:type\" content=\"" . $pageType . "\" />\n" .
              "    <meta property=\"og:site_name\" content=\"Sri Shringarr\" />\n" .
              "    <meta name=\"twitter:card\" content=\"summary_large_image\" />\n" .
              "    <meta name=\"twitter:title\" content=\"" . $title . "\" />\n" .
              "    <meta name=\"twitter:description\" content=\"" . $description . "\" />\n" .
              "    <meta name=\"twitter:image\" content=\"" . $imageUrl . "\" />\n";

// Replace static title in index.html with the OG Meta Tags block
$html = preg_replace('/<title>.*?<\/title>/', $ogMetaTags, $html);

echo $html;
?>
