import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class PaymentTest {

    @Test
    public void testToString() {
        Customer customer = new Customer(3, "Alice Johnson", "alice.johnson@example.com");
        Order order = new Order(1002, customer, 399.99);
        Payment payment = new Payment(2001, order, "Credit Card", 399.99);
        String expected = "Payment{paymentId=2001, order=" + order.toString() + ", paymentMethod='Credit Card', amount=399.99}";
        assertEquals(expected, payment.toString());
    }
}
