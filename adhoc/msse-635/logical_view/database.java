import java.util.HashMap;
import java.util.Map;

public class Database {
    private Map<Integer, Customer> customers = new HashMap<>();
    private Map<Integer, Order> orders = new HashMap<>();
    private Map<Integer, Inventory> inventories = new HashMap<>();
    private Map<Integer, Payment> payments = new HashMap<>();

    // Customer Methods
    public void addCustomer(Customer customer) {
        customers.put(customer.getCustomerId(), customer);
    }

    public Customer getCustomer(int customerId) {
        return customers.get(customerId);
    }

    // Order Methods
    public void addOrder(Order order) {
        orders.put(order.getOrderId(), order);
    }

    public Order getOrder(int orderId) {
        return orders.get(orderId);
    }

    // Inventory Methods
    public void addInventory(Inventory inventory) {
        inventories.put(inventory.getProductId(), inventory);
    }

    public Inventory getInventory(int productId) {
        return inventories.get(productId);
    }

    // Payment Methods
    public void addPayment(Payment payment) {
        payments.put(payment.getPaymentId(), payment);
    }

    public Payment getPayment(int paymentId) {
        return payments.get(paymentId);
    }

    // toString() Method
    @Override
    public String toString() {
        return "Database{" +
               "customers=" + customers +
               ", orders=" + orders +
               ", inventories=" + inventories +
               ", payments=" + payments +
               '}';
    }
}
