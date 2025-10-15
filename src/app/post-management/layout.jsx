import Sidebar from "@/components/sidebar";

export default function PostManagementLayout({ children }) {

  console.log("children");
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div> 
  );
}
