export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string;
          nik: string;
          address: string;
          phone: string | null;
          role: 'user' | 'admin';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          nik: string;
          address: string;
          phone?: string | null;
          role?: 'user' | 'admin';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          nik?: string;
          address?: string;
          phone?: string | null;
          role?: 'user' | 'admin';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      complaints: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          category: 'Infrastruktur' | 'Sosial' | 'Kebersihan' | 'Keamanan' | 'Pelayanan Publik';
          priority: 'Tinggi' | 'Sedang' | 'Rendah';
          status: 'Pending' | 'In Progress' | 'Solved';
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          category: 'Infrastruktur' | 'Sosial' | 'Kebersihan' | 'Keamanan' | 'Pelayanan Publik';
          priority?: 'Tinggi' | 'Sedang' | 'Rendah';
          status?: 'Pending' | 'In Progress' | 'Solved';
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          category?: 'Infrastruktur' | 'Sosial' | 'Kebersihan' | 'Keamanan' | 'Pelayanan Publik';
          priority?: 'Tinggi' | 'Sedang' | 'Rendah';
          status?: 'Pending' | 'In Progress' | 'Solved';
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          complaint_id: string;
          user_id: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          complaint_id: string;
          user_id: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          complaint_id?: string;
          user_id?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
  };
};

export type User = Database['public']['Tables']['users']['Row'];
export type Complaint = Database['public']['Tables']['complaints']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];

export type ComplaintWithUser = Complaint & {
  users: User;
};

export type CommentWithUser = Comment & {
  users: User;
};
