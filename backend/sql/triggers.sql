-- Tabla de Imagenes
CREATE TRIGGER SetDefaultImageAfterInsert AFTER INSERT ON ProductImages FOR EACH ROW WHEN NEW.ProductID IS NOT NULL BEGIN
UPDATE Products
SET
  ImageDefaultID = NEW.ImageID
WHERE
  ProductID = NEW.ProductID
  AND ImageDefaultID IS NULL;

END;