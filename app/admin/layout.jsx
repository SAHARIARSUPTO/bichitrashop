// app/admin/layout.jsx
import AdminNav from './AdminNav';

export const metadata = {
  title: 'অ্যাডমিন ড্যাশবোর্ড | Bichitra Shop (বিচিত্র শপ)',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLayout({ children }) {
  return <AdminNav>{children}</AdminNav>;
}
