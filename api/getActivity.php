<?php
header('Content-Type: application/json');

try {
    $db = new PDO('sqlite:' . realpath(__DIR__ . '/../cse383.db'));
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->query("
        SELECT t.id, t.endpoint, t.called_at, t.request_payload, t.response_metadata, e.title, e.author
        FROM transactions t
        LEFT JOIN ebooks e ON t.ebook_id = e.id
        ORDER BY t.called_at DESC
    ");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
