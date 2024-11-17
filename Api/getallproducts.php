<?php 
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Access-Control-Allow-Credentials: true");
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if($method == 'GET'){
    handleGet($pdo);
}


function handleGet($pdo) {
    $sql = "SELECT products.id as id , products.rate , products.product_name as name, products.product_price as price, products.product_description as description, products.product_image as thumbnail, products.options as options  , categories.category_name
FROM products
JOIN categories ON products.category_id = categories.id;";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($result as &$product) {
        $product['options'] = json_decode($product['options'], true); // Decode JSON string to array
    }
    echo json_encode($result);
}  