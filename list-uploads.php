<?php
// Simple script to list uploaded files for debugging
header('Content-Type: application/json');

$upload_dir = 'uploads/';
$files = [];

if (is_dir($upload_dir)) {
    $file_list = scandir($upload_dir);
    foreach ($file_list as $file) {
        if ($file !== '.' && $file !== '..') {
            $file_path = $upload_dir . $file;
            $files[] = [
                'filename' => $file,
                'size' => filesize($file_path),
                'modified' => date('Y-m-d H:i:s', filemtime($file_path)),
                'url' => 'https://natureharvest.osamaqaseem.online/uploads/' . $file
            ];
        }
    }
}

echo json_encode([
    'success' => true,
    'upload_dir' => $upload_dir,
    'file_count' => count($files),
    'files' => $files
], JSON_PRETTY_PRINT);
?>
