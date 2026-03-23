import { createRouter, createWebHistory } from "vue-router";

// Import các view
import ContactBook from "@/views/ContactBook.vue";
import AddContact from "@/views/AddContact.vue";
import EditContact from "@/views/EditContact.vue";

// Khai báo routes
const routes = [
  {
    path: "/",
    name: "contactbook",
    component: ContactBook,
  },
  {
    path: "/add",
    name: "contact.add",
    component: AddContact,
  },
  {
    path: "/contacts/:id",
    name: "contact.edit",
    component: EditContact,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
  },
];

// Tạo router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Export
export default router;