public class Order {
    private int orderId;
    private Customer customer;
    private double totalAmount;

    // Constructors
    public Order() { }

    public Order(int orderId, Customer customer, double totalAmount) {
        this.orderId = orderId;
        this.customer = customer;
        this.totalAmount = totalAmount;
    }

    // Getters and Setters
    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    // toString() Method
    @Override
    public String toString() {
        return "Order{" +
               "orderId=" + orderId +
               ", customer=" + customer +
               ", totalAmount=" + totalAmount +
               '}';
    }
}
