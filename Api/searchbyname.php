<?php 
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Access-Control-Allow-Credentials: true");
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if($method == 'GET'){
    searchProducts($pdo , $_GET['searchvalue']);
}


function searchProducts($pdo, $searchTerm) {
    // $sql = "SELECT * FROM products WHERE product_name LIKE :searchTerm ";
    $sql = "
    SELECT 
        products.product_name as name, products.product_price as price, products.product_description as description, products.product_image as thumbnail, products.options as options , 
        categories.category_name 
    FROM 
        products 
    JOIN 
        categories 
    ON 
        products.category_id = categories.id 
    WHERE 
        products.product_name LIKE :searchTerm
";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['searchTerm' => '%' . $searchTerm . '%']); // Use wildcard % for partial matching
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($result as &$product) {
        $product['options'] = json_decode($product['options'], true); // Decode JSON string to array
    }
    if ($stmt->rowCount() > 0) {
        echo json_encode($result); // Return matching products
    } else {
        echo json_encode(['message' => 'No products found']);
    }
}