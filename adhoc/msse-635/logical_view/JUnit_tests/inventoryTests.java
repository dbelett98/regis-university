import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class InventoryTest {

    @Test
    public void testToString() {
        Inventory inventory = new Inventory(501, "Laptop", 50);
        String expected = "Inventory{productId=501, productName='Laptop', quantity=50}";
        assertEquals(expected, inventory.toString());
    }
}
