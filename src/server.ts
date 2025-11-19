import express from "express";
import { SuperAdmin } from "./functions/seed-super-admin";
import isAdmin from "./middlewares/admin.middleware";
import auth from "./middlewares/user.middleware";
import { adminRoutes } from "./routes/admin/admin.routes";
import { publicRoutes } from "./routes/auth/public.routes";
import { customerRoutes } from "./routes/customer/customer.routes";
import { petRoutes } from "./routes/pet-management/pet.routes";
import { schedulingRoutes } from "./routes/scheduling/scheduling.routes";

const app = express();

app.use(express.json());

app.use("/", publicRoutes);
app.use("/scheduling", auth, schedulingRoutes);
app.use("/admin", auth, isAdmin, adminRoutes);
app.use("/pets", auth, petRoutes);
app.use("/customer", auth, customerRoutes);

const PORT = 3000;
app.listen(PORT, async () => {
	console.log("Server Running");
	await SuperAdmin();
});
