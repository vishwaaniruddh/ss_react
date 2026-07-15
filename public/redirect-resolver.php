<?php
/**
 * Legacy URL Redirect Resolver
 * Handles old detail.php, jewel_detail.php, and apparel_detail.php URLs
 * 
 * Examples:
 * - detail.php?id=123&type=1 → /product/product-name-123
 * - jewel_detail.php?id=7895&type=1&days=3 → /product/product-name-7895
 * - apparel_detail.php?id=2520&days=3&page=1 → /product/product-name-2520
 */
// Find config.php
$configPaths = [
    './API/config.php',
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
    header('Location: /shop', true, 301);
    exit;
}


mysqli_set_charset($con, 'utf8mb4');

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

$rawType = isset($_GET['type']) ? trim(strtolower($_GET['type'])) : '';
if (is_numeric($rawType)) {
    $type = (int) $rawType;
} else if ($rawType === 'jewellery' || $rawType === 'jewel') {
    $type = 1;
} else if ($rawType === 'garments' || $rawType === 'garment' || $rawType === 'apparel') {
    $type = 2;
} else {
    $type = 0;
}

if ($id <= 0) {
    header("Location: https://srishringarr.com/shop", true, 301);
    exit;
}

// Determine which table to query based on type
// type=1 → jewellery (product table)
// type=2 → garment/apparel (garment_product table)
// If no type specified, try jewellery first, then garment
if ($type == 2) {
    // Garment/Apparel product
    $q = "SELECT gproduct_name AS name, gproduct_id AS pid FROM garment_product WHERE gproduct_id = $id LIMIT 1";
    $r = mysqli_query($con, $q);

    if ($r && mysqli_num_rows($r) > 0) {
        $row = mysqli_fetch_assoc($r);
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $row['name'])));
        $url = "https://srishringarr.com/product/{$slug}-{$row['pid']}";
        header("Location: $url", true, 301);
        exit;
    }
} else {
    // Jewellery product (type=1 or no type specified)
    $q = "SELECT product_name AS name, product_id AS pid FROM product WHERE product_id = $id LIMIT 1";
    $r = mysqli_query($con, $q);

    if ($r && mysqli_num_rows($r) > 0) {
        $row = mysqli_fetch_assoc($r);
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $row['name'])));
        $url = "https://srishringarr.com/product/{$slug}-{$row['pid']}";
        header("Location: $url", true, 301);
        exit;
    }

    // If not found in product table and no type specified, try garment_product
    if ($type == 0) {
        $q = "SELECT gproduct_name AS name, gproduct_id AS pid FROM garment_product WHERE gproduct_id = $id LIMIT 1";
        $r = mysqli_query($con, $q);

        if ($r && mysqli_num_rows($r) > 0) {
            $row = mysqli_fetch_assoc($r);
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $row['name'])));
            $url = "https://srishringarr.com/product/{$slug}-{$row['pid']}";
            header("Location: $url", true, 301);
            exit;
        }
    }
}

// ID no longer exists → send to shop, NOT a 404
header("Location: https://srishringarr.com/shop", true, 301);
exit;
?>