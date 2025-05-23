<?php
require_once 'logTransactions.php';
header('Content-Type: application/json');

$OPENAI_API_KEY = "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";

$prompt = $_POST['prompt'];
if (!$prompt) {
    echo json_encode(['error' => 'Missing prompt']);
    exit;
}

$data = [
    "model" => "gpt-4o",
    "messages" => [
        ["role" => "system", "content" => "You are writing short eBooks based on the prompt of a client. The eBooks will be approximately 15000 characters long."],
        ["role" => "user", "content" => "Write the content of an eBook on this idea: $prompt. No need to write a title."]
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
$content = $json['choices'][0]['message']['content'] ?? null;

if ($content) {
    $db = new PDO('sqlite:' . realpath(__DIR__ . '/../cse383.db'));
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    logTransaction($db, 'generateContent', null, ['prompt' => (string)$prompt], ['content' => $content]);
}

echo json_encode(['content' => $content ?: 'Unable to generate content.']);
