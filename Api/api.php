<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Access-Control-Allow-Credentials: true");
error_reporting(E_ALL);
ini_set('display_errors', 1);
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        handleGet($pdo);
        break;
    case 'POST':
        handlePost($pdo);
        break;
    case 'PUT':
        handlePut($pdo, $input);
        break;  
    case 'DELETE':
        handleDelete($pdo, $input);
        break;
    default:
        echo json_encode(['message' => 'Invalid request method']);
        break;
}

function handleGet($pdo) {
    $sql = "SELECT products.id as id , products.product_name as name, products.product_price as price, products.product_description as description, products.product_image as thumbnail, products.options as options  , categories.category_name
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


function handlePost($pdo) {
    $options = is_array($_POST['options']) ? json_encode($_POST['options']) : $_POST['options']; // Encode only if it's an array

    if (isset($_FILES['product_image']) && $_FILES['product_image']['error'] == 0) {
        $imageTmpName = $_FILES['product_image']['tmp_name'];
        $imageName = basename($_FILES['product_image']['name']);
        $imageSize = $_FILES['product_image']['size'];
        $imageError = $_FILES['product_image']['error'];
        
        
        $targetDir = "uploads/"; 
        $targetFilePath = $targetDir . $imageName;

       
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif' , 'webp' , 'jfif'];
        $fileExtension = strtolower(pathinfo($imageName, PATHINFO_EXTENSION));

        
        if (!in_array($fileExtension, $allowedExtensions)) {
            echo json_encode(['message' => 'Invalid image format. Only JPG, JPEG, PNG, and GIF are allowed.']);
            return;
        }

        
        if ($imageSize > 5 * 1024 * 1024) {
            echo json_encode(['message' => 'Image size is too large. Maximum size is 5MB.']);
            return;
        }

        
        if (move_uploaded_file($imageTmpName, $targetFilePath)) {
            
            $sql = "INSERT INTO products (product_name, product_price, product_description, product_image , options , rate  ,category_id ) 
                    VALUES (:name, :price, :description, :image , :options , :rate ,:category_id)";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'name' => $_POST['product_name'],
                'price' => $_POST['product_price'],
                'description' => $_POST['product_description'],
                'category_id' => $_POST['product_category_id'],
                'image' => $targetFilePath ,
                'options' => $options ,
                'rate' => $_POST['product_rate'],
            ]);

            echo json_encode(['message' => 'Product created successfully', 'image' => $targetFilePath]);
        } else {
            echo json_encode(['message' => 'Failed to upload image.']);
        }
    } else {
        echo json_encode(['message' => 'No image uploaded or there was an error with the image upload.']);
    }
}



function handlePut($pdo , $input) {
    $find = "SELECT * FROM products WHERE id = :id";
    $check = $pdo->prepare($find);
    $check->execute(['id' => $input['id']]);
    
    if ($check->rowCount() === 0) {
        echo json_encode(['message' => 'Product not found']);
        return;
    }

    
        $sql = "UPDATE products SET product_name = :name, product_price = :price, product_description = :description WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'name' => $input['product_name'],
            'price' => $input['product_price'],
            'description' => $input['product_description'],
            'id' => $input['id']
        ]);

        echo json_encode(['message' => 'Product updated successfully']);
    
}




function handleDelete($pdo, $input) {
    $sql = "DELETE FROM products WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['id' => $_GET['id']]);
    echo json_encode(['message' => 'User deleted successfully']);
}
?>