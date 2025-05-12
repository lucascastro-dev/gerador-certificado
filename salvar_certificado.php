<?php
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo "Dados inválidos.";
    exit;
}

$professor = preg_replace("/[^a-zA-Z0-9]/", "", $data["professor"]);
$dataEvento = date("Y-m-d", strtotime($data["dataEvento"]));
$agora = date("Y-m-d_H-i-s");

$nomeArquivo = "certificados_{$professor}_{$agora}.txt";
$caminho = __DIR__ . "/certificados";
if (!is_dir($caminho)) {
    mkdir($caminho, 0777, true);
}

$arquivoCompleto = $caminho . "/" . $nomeArquivo;

file_put_contents($arquivoCompleto, json_encode($data, JSON_PRETTY_PRINT));

echo "Arquivo salvo com sucesso: $nomeArquivo";
?>
