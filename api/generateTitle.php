<?php
header('Content-Type: application/json');

$OPENAI_API_KEY = "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";

$content = $_POST['content'];
if (!$content) {
    echo json_encode(['error' => 'Missing content']);
    exit;
}

$data = [
    "model" => "gpt-4o",
    "messages" => [
        ["role" => "system", "content" => "You are writing titles for short eBooks based on the content of the eBook."],
        ["role" => "user", "content" => "Write the title of the eBook based on this story: $content"]
    ],
    "temperature" => 0.7
];

$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer $OPENAI_API_KEY",
        "Content-Type: application/json"
    ],
    CURLOPT_POSTFIELDS => json_encode($data)
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$json = json_decode($response, true);
$title = $json['choices'][0]['message']['content'] ?? null;

echo json_encode(['title' => $title ?: 'Unable to generate title.']);
