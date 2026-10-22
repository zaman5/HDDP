<?php
/**
 * HDDP Consultants - Accelerec Jobs API Proxy
 * 
 * Proxies job listings from the Accelerec Portal API securely on the server-side,
 * protecting your organization's API key from browser inspection.
 *
 * Usage:
 * - Direct HTTP GET: /jobs.php
 * - Until you receive your active API key from Accelerec Support, visitors are
 *   served via the embedded iFrame on the Careers page:
 *   <iframe src="https://careers.accelerec.com/career/HDDP-Consultants" width="100%" height="850"></iframe>
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, x-api-key');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Once Accelerec support provides your key, paste it below or define ACCELEREC_API_KEY environment variable.
$apiKey = getenv('ACCELEREC_API_KEY') ?: '';
$apiUrl = getenv('ACCELEREC_JOBS_URL') ?: 'https://portal.accelerec.com/api/v1/organization/jobs';

// Check if API key is still the placeholder
if (empty($apiKey) || $apiKey === 'SECRET_API_KEY' || $apiKey === 'YOUR_API_KEY') {
    echo json_encode([
        'success' => false,
        'pendingKey' => true,
        'message' => 'Contact support to get your API key and enable API access. Please use the embedded iFrame option.',
        'iframe_embed' => '<iframe src="https://careers.accelerec.com/career/HDDP-Consultants" width="100%" height="850" frameborder="0"></iframe>',
        'data' => []
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// Initialize cURL session
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'x-api-key: ' . $apiKey,
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(502);
    echo json_encode([
        'success' => false,
        'error' => 'cURL error: ' . $curlError
    ]);
    exit;
}

http_response_code($httpCode ?: 200);
echo $response;
