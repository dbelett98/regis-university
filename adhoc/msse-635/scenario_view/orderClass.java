public class Order {
    private static int orderCounter = 1000;
    private int orderId;
    private Customer customer;
    private Inventory inventory;
    private int quantity;
    private double totalAmount;

    // Constructors
    public Order() { }

    public Order(Customer customer, Inventory inventory, int quantity) {
        this.orderId = orderCounter++;
        this.customer = customer;
        this.inventory = inventory;
        this.quantity = quantity;
        this.totalAmount = inventory.getPrice() * quantity;
    }



    // Use Case Method: Place Order
    public static Order placeOrder(Customer customer, Inventory inventory, int quantity) {
        if (inventory.isAvailable(quantity)) {
            inventory.reduceQuantity(quantity);
            Order order = new Order(customer, inventory, quantity);
            System.out.println("Order placed: " + order);
            return order;
        } else {
            System.out.println("Order failed: Insufficient stock for " + inventory.getProductName());
            return null;
        }
    }

    // toString() Method
    @Override
    public String toString() {
        return "Order{" +
               "orderId=" + orderId +
               ", customer=" + customer +
               ", inventory=" + inventory +
               ", quantity=" + quantity +
               ", totalAmount=" + totalAmount +
               '}';
    }
}
