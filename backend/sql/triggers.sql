-- Tabla de Imagenes
CREATE TRIGGER SetDefaultImageAfterInsert AFTER INSERT ON ProductImages FOR EACH ROW WHEN NEW.ProductID IS NOT NULL BEGIN
UPDATE Products
SET
  ImageDefaultID = NEW.ImageID
WHERE
  ProductID = NEW.ProductID
  AND ImageDefaultID IS NULL;

END;

-- Actualiza ventas del producto y stock
CREATE TRIGGER update_product_sales
AFTER INSERT ON OrderProducts
FOR EACH ROW
BEGIN
    UPDATE Products
    SET TotalSales = TotalSales + NEW.Quantity,
        StockAvailability = StockAvailability - NEW.Quantity
    WHERE ProductID = NEW.ProductID;
END;

-- Actualiza comentarios
CREATE TRIGGER update_product_comments
AFTER INSERT ON Reviews
FOR EACH ROW
BEGIN
    DECLARE avg_rating REAL;
    -- Calcular la valoración media de todos los comentarios para el producto
    SELECT AVG(AssignedRating) INTO avg_rating FROM Reviews WHERE ProductID = NEW.ProductID;
    -- Actualizar la valoración media en la tabla Products
    UPDATE Products
    SET TotalComments = TotalComments + 1,
        Rating = avg_rating
    WHERE ProductID = NEW.ProductID;
END;


-- Actualizar el status de un pedido
CREATE TRIGGER update_order_status
AFTER UPDATE ON OrderProducts
FOR EACH ROW
BEGIN
    UPDATE Orders
    SET OrderStatus = NEW.OrderStatus
    WHERE OrderID = NEW.OrderID;
END;

-- Actualizar las ventas de una tienda

CREATE TRIGGER update_shop_sales
AFTER INSERT ON OrderProducts
FOR EACH ROW
BEGIN
    UPDATE Shops
    SET TotalSales = TotalSales + NEW.Quantity
    WHERE ShopID = NEW.ShopID;
END;

-- Actualiza el estado global del pedido

CREATE TRIGGER update_order_status_trigger
AFTER UPDATE ON OrderProducts
FOR EACH ROW
BEGIN
    DECLARE order_status TEXT;
    SELECT OrderStatus INTO order_status FROM Orders WHERE OrderID = NEW.OrderID;
    IF (SELECT COUNT(DISTINCT OrderStatus) FROM OrderProducts WHERE OrderID = NEW.OrderID) = 1 THEN
        UPDATE Orders
        SET OrderStatus = NEW.OrderStatus
        WHERE OrderID = NEW.OrderID AND order_status != NEW.OrderStatus;
    END IF;
END;
