import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class UseCaseTest {

    @Test
    public void testRegisterCustomer() {
        Customer customer = Customer.registerCustomer("Emily Evans", "emily.evans@example.com");
        assertNotNull(customer);
        assertEquals("Emily Evans", customer.getName());
        assertEquals("emily.evans@example.com", customer.getEmail());
    }

    @Test
    public void testCheckInventory() {
        Inventory inventory = new Inventory(101, "Smartphone", 20, 699.99);
        assertTrue(inventory.isAvailable(5));
        assertFalse(inventory.isAvailable(25));
    }

    @Test
    public void testPlaceOrder_Success() {
        Customer customer = Customer.registerCustomer("Frank Foster", "frank.foster@example.com");
        Inventory inventory = new Inventory(102, "Headphones", 15, 199.99);
        Order order = Order.placeOrder(customer, inventory, 3);
        assertNotNull(order);
        assertEquals(102, order.getInventory().getProductId());
        assertEquals(3, order.getQuantity());
        assertEquals(199.99 * 3, order.getTotalAmount());
        assertEquals(12, inventory.getQuantity());
    }

    @Test
    public void testPlaceOrder_Failure() {
        Customer customer = Customer.registerCustomer("Grace Green", "grace.green@example.com");
        Inventory inventory = new Inventory(103, "Camera", 2, 499.99);
        Order order = Order.placeOrder(customer, inventory, 5);
        assertNull(order);
        assertEquals(2, inventory.getQuantity()); // Quantity should remain the same
    }

    @Test
    public void testProcessPayment() {
        Customer customer = Customer.registerCustomer("Henry Hill", "henry.hill@example.com");
        Inventory inventory = new Inventory(104, "Laptop", 5, 1099.99);
        Order order = Order.placeOrder(customer, inventory, 2);
        Payment payment = Payment.makePayment(order, "Credit Card");
        assertNotNull(payment);
        assertEquals(order.getTotalAmount(), payment.getAmount());
    }
}
