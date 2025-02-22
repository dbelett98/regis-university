import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class OrderTest {

    @Test
    public void testToString() {
        Customer customer = new Customer(2, "Jane Smith", "jane.smith@example.com");
        Order order = new Order(1001, customer, 299.99);
        String expected = "Order{orderId=1001, customer=" + customer.toString() + ", totalAmount=299.99}";
        assertEquals(expected, order.toString());
    }
}
