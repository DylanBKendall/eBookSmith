<?php
function logTransaction($db, $endpoint, $ebookId = null, $requestPayload = null, $responseMetadata = null)
{
    $requestJson = is_array($requestPayload)
        ? json_encode($requestPayload, JSON_UNESCAPED_UNICODE)
        : null;

    $responseJson = is_array($responseMetadata)
        ? json_encode($responseMetadata, JSON_UNESCAPED_UNICODE)
        : null;

    $stmt = $db->prepare("
        INSERT INTO transactions (ebook_id, endpoint, request_payload, response_metadata, called_at)
        VALUES (:ebook_id, :endpoint, :request_payload, :response_metadata, datetime('now'))
    ");
    $stmt->execute([
        ':ebook_id' => $ebookId,
        ':endpoint' => $endpoint,
        ':request_payload' => $requestJson,
        ':response_metadata' => $responseJson
    ]);
}