import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  decimal,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ======================= SESSION STORAGE (Replit Auth) =======================
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// ======================= USERS (Replit Auth) =======================
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role").notNull().default("customer"), // "customer" | "admin"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// ======================= PRODUCTS =======================
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // "feminino", "masculino", "conjuntos", etc
  images: text("images").array().default(sql`ARRAY[]::text[]`),
  colors: text("colors").array().default(sql`ARRAY[]::text[]`),
  sizes: text("sizes").array().default(sql`ARRAY[]::text[]`),
  stock: integer("stock").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products, {
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  price: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Preço deve ser maior que zero"),
  category: z.string().min(1, "Categoria é obrigatória"),
  colors: z.array(z.string()).min(1, "Pelo menos uma cor deve ser selecionada"),
  sizes: z.array(z.string()).min(1, "Pelo menos um tamanho deve ser selecionado"),
  stock: z.number().min(0, "Estoque não pode ser negativo"),
  isActive: z.boolean(),
}).pick({
  name: true,
  description: true,
  price: true,
  category: true,
  images: true,
  colors: true,
  sizes: true,
  stock: true,
  isActive: true,
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// ======================= ORDERS =======================
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // "pending", "confirmed", "shipped", "delivered", "cancelled"
  paymentMethod: text("payment_method").notNull().default("whatsapp"), // "whatsapp", "pix", "credit_card" (future)
  paymentStatus: text("payment_status").notNull().default("pending"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull().$type<string>(),
  customerInfo: jsonb("customer_info").$type<{
    name: string;
    email: string;
    phone: string;
  }>().notNull(),
  items: jsonb("items").$type<Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    selectedColor: string;
    selectedSize: string;
    image?: string;
  }>>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = z.object({
  userId: z.string(),
  paymentMethod: z.enum(["whatsapp", "pix", "credit_card"]),
  total: z.union([z.number(), z.string()]).transform(val => String(val)),
  customerInfo: z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(1, "Telefone é obrigatório"),
  }),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
    selectedColor: z.string(),
    selectedSize: z.string(),
    image: z.string().optional(),
  })).min(1, "Pelo menos um item é obrigatório"),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// ======================= CART ITEMS (optional, for logged in users) =======================
export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  selectedColor: text("selected_color").notNull(),
  selectedSize: text("selected_size").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCartItemSchema = z.object({
  userId: z.string().optional(),
  productId: z.string(),
  quantity: z.number().min(1, "Quantidade deve ser maior que 0"),
  selectedColor: z.string().min(1, "Cor deve ser selecionada"),
  selectedSize: z.string().min(1, "Tamanho deve ser selecionado"),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
