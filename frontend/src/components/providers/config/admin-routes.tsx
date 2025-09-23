// config/admin-routes.ts
import { Home, User ,CopyPlus ,DatabaseZap  } from "lucide-react";

export const adminRoutes = [
  { title: "Home", url: "/admin", icon: Home },
  { title: "Users", url: "/admin/users", icon: User  },
  { title: "Add Questions", url: "/admin/add_ques", icon: CopyPlus  },
  { title: "All Questions", url: "/admin/all_data", icon: DatabaseZap   },
  ];
  