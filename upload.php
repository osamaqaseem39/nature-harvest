<?php
// Increase execution time and memory limit for large file uploads
set_time_limit(300); // 5 minutes
ini_set('memory_limit', '256M');
ini_set('max_execution_time', 300);
ini_set('upload_max_filesize', '10M');
ini_set('post_max_size', '10M');

// Allow CORS from multiple domains including localhost for development
$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:5173',
    'http://localhost:4173',
    'https://admin.wingzimpex.com',
    'https://natureharvest.osamaqaseem.online',
    'https://juice-company-server.vercel.app',
    'https://nature-harvest-dashbaord.vercel.app',
    'https://natureharvest-web.vercel.app'
];

// Get the origin from the request
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Check if origin is allowed
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    // For development, allow localhost origins
    if (strpos($origin, 'localhost') !== false || strpos($origin, '127.0.0.1') !== false) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        // Fallback for production
        header('Access-Control-Allow-Origin: https://natureharvest.osamaqaseem.online');
    }
}

// Set CORS headers
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400'); // 24 hours

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set content type for JSON responses
header('Content-Type: application/json');

$allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$max_size = 10 * 1024 * 1024; // 10MB (increased from 5MB)

// Function to send JSON response
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

// Function to send error response
function sendError($message, $statusCode = 400) {
    sendResponse(['success' => false, 'message' => $message], $statusCode);
}

// Function to send success response
function sendSuccess($data) {
    sendResponse(['success' => true, 'message' => 'Files uploaded successfully', 'data' => $data]);
}

if(isset($_FILES['file'])){
    $file = $_FILES['file'];
    
    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $error_messages = [
            UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize directive',
            UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE directive',
            UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
            UPLOAD_ERR_NO_FILE => 'No file was uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
            UPLOAD_ERR_EXTENSION => 'File upload stopped by extension'
        ];
        
        $error_message = $error_messages[$file['error']] ?? 'Unknown upload error';
        sendError($error_message, 400);
    }
    
    // Validate file type
    if (!in_array($file['type'], $allowed_types)) {
        sendError('Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed.');
    }
    
    // Validate file size
    if ($file['size'] > $max_size) {
        sendError('File too large. Maximum allowed size is 10MB.');
    }
    
    // Additional security: check file extension
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!in_array($ext, $allowed_extensions)) {
        sendError('Invalid file extension. Only JPG, PNG, GIF, and WEBP are allowed.');
    }
    
    // Generate unique filename
    $uniqueName = time() . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
    $upload_dir = 'uploads/';
    
    // Create upload directory if it doesn't exist
    if (!file_exists($upload_dir)) {
        if (!mkdir($upload_dir, 0777, true)) {
            sendError('Failed to create upload directory', 500);
        }
    }
    
    $target = $upload_dir . $uniqueName;
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $target)) {
        // Verify the file was actually uploaded and is readable
        if (file_exists($target) && is_readable($target)) {
            $fileUrl = 'https://natureharvest.osamaqaseem.online/uploads/' . $uniqueName;
            
            // Return response in the format expected by GalleryUpload component
            sendSuccess([
                'urls' => [$fileUrl],
                'files' => [
                    [
                        'success' => true,
                        'url' => $fileUrl,
                        'filename' => $uniqueName
                    ]
                ]
            ]);
        } else {
            sendError('File upload verification failed', 500);
        }
    } else {
        sendError('Failed to upload file. Please try again.');
    }
} else {
    sendError('No file uploaded');
}
?>
