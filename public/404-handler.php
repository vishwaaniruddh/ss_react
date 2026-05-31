<?php
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

// Serve the React app
readfile(__DIR__ . '/index.html');
?>
