public class Customer {
    private int customerId;
    private String name;
    private String email;
    private static int customerCounter = 1;

    // Constructors
    public Customer() { }

    public Customer(String name, String email) {
        this.customerId = customerCounter++;
        this.name = name;
        this.email = email;
    }


    // Use Case Method: Register Customer
    public static Customer registerCustomer(String name, String email) {
        Customer customer = new Customer(name, email);
        System.out.println("Customer registered: " + customer);
        return customer;
    }

    // toString() Method
    @Override
    public String toString() {
        return "Customer{" +
               "customerId=" + customerId +
               ", name='" + name + '\'' +
               ", email='" + email + '\'' +
               '}';
    }
}
