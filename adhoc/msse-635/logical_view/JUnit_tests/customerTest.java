import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CustomerTest {

    @Test
    public void testToString() {
        Customer customer = new Customer(1, "John Doe", "john.doe@example.com");
        String expected = "Customer{customerId=1, name='John Doe', email='john.doe@example.com'}";
        assertEquals(expected, customer.toString());
    }
}
