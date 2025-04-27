<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Merchant Order Management</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://ujoniobvifxkbhhfopwu.supabase.co/storage/v1/object/public/ownersite/site/styles.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-4">
        <h1 class="text-center mb-4">Merchant Order Management</h1>
        
        <!-- Tab Navigation -->
        <ul class="nav nav-tabs mb-4" id="orderTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="pending-tab" data-bs-toggle="tab" data-bs-target="#pending" type="button" role="tab">
                    Pending Orders
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="completed-tab" data-bs-toggle="tab" data-bs-target="#completed" type="button" role="tab">
                    Completed Orders
                </button>
            </li>
        </ul>

        <!-- Tab Content -->
        <div class="tab-content" id="orderTabsContent">
            <div class="tab-pane fade show active" id="pending" role="tabpanel">
                <div class="card">
                    <div class="card-body">
                        <div id="pending-orders-container">
                            <!-- Pending orders will be dynamically loaded here -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="completed" role="tabpanel">
                <div class="card">
                    <div class="card-body">
                        <div id="completed-orders-container">
                            <!-- Completed orders will be dynamically loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://ujoniobvifxkbhhfopwu.supabase.co/storage/v1/object/public/ownersite/site/script.js"></script>
</body>
</html>

