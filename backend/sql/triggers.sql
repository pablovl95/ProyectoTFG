CREATE TRIGGER SetDefaultImageAfterInsert
AFTER INSERT ON ProductImages
FOR EACH ROW
BEGIN
    UPDATE Products
    SET ImageDefaultID = NEW.ImageID
    WHERE ProductID = NEW.ProductID
    AND ImageDefaultID IS NULL;
END;

CREATE TRIGGER UpdateOrderProductsStatus
AFTER UPDATE OF OrderStatus ON Orders
FOR EACH ROW
BEGIN
    UPDATE OrderProducts
    SET OrderStatus = NEW.OrderStatus
    WHERE OrderID = NEW.OrderID;
END;

CREATE TRIGGER update_product_sales
AFTER INSERT ON OrderProducts
FOR EACH ROW
BEGIN
    UPDATE Products
    SET TotalSales = TotalSales + NEW.Quantity,
        StockAvailability = StockAvailability - NEW.Quantity
    WHERE ProductID = NEW.ProductID;
END;

CREATE TRIGGER UpdateProductRatingAndComments
AFTER INSERT ON Reviews
FOR EACH ROW
BEGIN
    UPDATE Products
    SET Rating = (SELECT AVG(AssignedRating) FROM Reviews WHERE ProductID = NEW.ProductID),
        TotalComments = (SELECT COUNT(*) FROM Reviews WHERE ProductID = NEW.ProductID)
    WHERE ProductID = NEW.ProductID;
END;

CREATE TRIGGER update_order_status
AFTER UPDATE ON OrderProducts
FOR EACH ROW
BEGIN
    UPDATE Orders
    SET OrderStatus = NEW.OrderStatus
    WHERE OrderID = NEW.OrderID;
END;

CREATE TRIGGER update_shop_sales
AFTER INSERT ON OrderProducts
FOR EACH ROW
BEGIN
    UPDATE Shops
    SET TotalSales = TotalSales + NEW.Quantity
    WHERE ShopID = NEW.ShopID;
END;

CREATE TRIGGER update_products_sales
AFTER INSERT ON OrderProducts
FOR EACH ROW
BEGIN
    UPDATE Products
    SET TotalSales = TotalSales + NEW.Quantity
    WHERE ProductID = NEW.ProductID;
END;

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
