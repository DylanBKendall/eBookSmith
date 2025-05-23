<?php
require_once('../final.class.php');
require_once('logTransactions.php');
header('Content-Type: application/json');

$title   = $_POST['title']   ?? '';
$content = $_POST['content'] ?? '';
$author  = $_POST['author']  ?? '';
$cover   = $_FILES['cover']  ?? null;

if (!$title || !$content || !$author) {
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

try {
    $result = final_rest::createEpub($title, $author, $content, $cover);

    $db = new PDO('sqlite:' . __DIR__ . '/../cse383.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->prepare(
        "INSERT INTO ebooks (title, author, content, cover_path)
         VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([
        $title,
        $author,
        $content,
        $result['coverPath']
    ]);
    $ebookId = $db->lastInsertId();

    logTransaction(
        $db,
        'generateEBook',
        $ebookId,
        ['title' => $title, 'author' => $author],
        ['file' => $result['epubPath']]
    );

    echo json_encode(['downloadUrl' => $result['epubPath']]);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}