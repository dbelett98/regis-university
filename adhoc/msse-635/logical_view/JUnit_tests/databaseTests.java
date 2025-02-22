import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class DatabaseTest {

    @Test
    public void testToString() {
        Database database = new Database();

        Customer customer = new Customer(1, "John Doe", "john.doe@example.com");
        database.addCustomer(customer);

        Order order = new Order(100, customer, 299.99);
        database.addOrder(order);

        Inventory inventory = new Inventory(500, "Laptop", 25);
        database.addInventory(inventory);

        Payment payment = new Payment(200, order, "Credit Card", 299.99);
        database.addPayment(payment);

        String expected = "Database{" +
                "customers={" + customer.getCustomerId() + "=" + customer.toString() + "}, " +
                "orders={" + order.getOrderId() + "=" + order.toString() + "}, " +
                "inventories={" + inventory.getProductId() + "=" + inventory.toString() + "}, " +
                "payments={" + payment.getPaymentId() + "=" + payment.toString() + "}" +
                "}";

        assertEquals(expected, database.toString());
    }
}
