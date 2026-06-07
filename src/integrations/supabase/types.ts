export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          client_id: string | null;
          ended_at: string | null;
          id: string;
          session_id: string | null;
          started_at: string;
          title: string | null;
          user_id: string;
        };
        Insert: {
          client_id?: string | null;
          ended_at?: string | null;
          id?: string;
          session_id?: string | null;
          started_at?: string;
          title?: string | null;
          user_id: string;
        };
        Update: {
          client_id?: string | null;
          ended_at?: string | null;
          id?: string;
          session_id?: string | null;
          started_at?: string;
          title?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_conversations_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_insights: {
        Row: {
          action_required: boolean;
          client_id: string;
          description: string;
          generated_at: string;
          id: string;
          insight_type: string;
          priority: string;
          resolved: boolean;
          title: string;
        };
        Insert: {
          action_required?: boolean;
          client_id: string;
          description: string;
          generated_at?: string;
          id?: string;
          insight_type?: string;
          priority?: string;
          resolved?: boolean;
          title: string;
        };
        Update: {
          action_required?: boolean;
          client_id?: string;
          description?: string;
          generated_at?: string;
          id?: string;
          insight_type?: string;
          priority?: string;
          resolved?: boolean;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_insights_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_messages: {
        Row: {
          conversation_id: string;
          created_at: string;
          id: string;
          message: string;
          role: string;
          tokens_used: number | null;
        };
        Insert: {
          conversation_id: string;
          created_at?: string;
          id?: string;
          message: string;
          role: string;
          tokens_used?: number | null;
        };
        Update: {
          conversation_id?: string;
          created_at?: string;
          id?: string;
          message?: string;
          role?: string;
          tokens_used?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "ai_conversations";
            referencedColumns: ["id"];
          },
        ];
      };
      business_challenges: {
        Row: {
          category: string | null;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
        };
        Insert: {
          category?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
        };
        Update: {
          category?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
        };
        Relationships: [];
      };
      client_appraisals: {
        Row: {
          admin_notes: string | null;
          business_structure: string | null;
          challenges: string | null;
          client_id: string | null;
          company_name: string | null;
          compliance_items: string[];
          contact_person: string | null;
          created_at: string;
          current_systems: string[];
          email: string;
          employee_count: number | null;
          engagement_model: string | null;
          estimated_price_range: string | null;
          expected_outcomes: string | null;
          full_name: string;
          id: string;
          industry: string | null;
          is_registered: boolean | null;
          long_term_goals: string | null;
          missing_systems: string | null;
          nature_of_business: string | null;
          objectives: string[];
          operational_gaps: string | null;
          opportunity_interests: string[];
          pain_points: string[];
          phone: string | null;
          physical_address: string | null;
          planning_expansion: boolean | null;
          preferred_budget_range: string | null;
          pricing_notes: string | null;
          project_id: string | null;
          project_name: string | null;
          recommended_package: string | null;
          request_type: string;
          required_systems: string[];
          reviewed_at: string | null;
          reviewed_by: string | null;
          seeking_funding: boolean | null;
          short_term_goals: string | null;
          status: string;
          tender_experience: boolean | null;
          updated_at: string;
          urgent_intervention: string | null;
          user_id: string;
          website_links: string | null;
          years_in_operation: number | null;
        };
        Insert: {
          admin_notes?: string | null;
          business_structure?: string | null;
          challenges?: string | null;
          client_id?: string | null;
          company_name?: string | null;
          compliance_items?: string[];
          contact_person?: string | null;
          created_at?: string;
          current_systems?: string[];
          email: string;
          employee_count?: number | null;
          engagement_model?: string | null;
          estimated_price_range?: string | null;
          expected_outcomes?: string | null;
          full_name: string;
          id?: string;
          industry?: string | null;
          is_registered?: boolean | null;
          long_term_goals?: string | null;
          missing_systems?: string | null;
          nature_of_business?: string | null;
          objectives?: string[];
          operational_gaps?: string | null;
          opportunity_interests?: string[];
          pain_points?: string[];
          phone?: string | null;
          physical_address?: string | null;
          planning_expansion?: boolean | null;
          preferred_budget_range?: string | null;
          pricing_notes?: string | null;
          project_id?: string | null;
          project_name?: string | null;
          recommended_package?: string | null;
          request_type?: string;
          required_systems?: string[];
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          seeking_funding?: boolean | null;
          short_term_goals?: string | null;
          status?: string;
          tender_experience?: boolean | null;
          updated_at?: string;
          urgent_intervention?: string | null;
          user_id: string;
          website_links?: string | null;
          years_in_operation?: number | null;
        };
        Update: {
          admin_notes?: string | null;
          business_structure?: string | null;
          challenges?: string | null;
          client_id?: string | null;
          company_name?: string | null;
          compliance_items?: string[];
          contact_person?: string | null;
          created_at?: string;
          current_systems?: string[];
          email?: string;
          employee_count?: number | null;
          engagement_model?: string | null;
          estimated_price_range?: string | null;
          expected_outcomes?: string | null;
          full_name?: string;
          id?: string;
          industry?: string | null;
          is_registered?: boolean | null;
          long_term_goals?: string | null;
          missing_systems?: string | null;
          nature_of_business?: string | null;
          objectives?: string[];
          operational_gaps?: string | null;
          opportunity_interests?: string[];
          pain_points?: string[];
          phone?: string | null;
          physical_address?: string | null;
          planning_expansion?: boolean | null;
          preferred_budget_range?: string | null;
          pricing_notes?: string | null;
          project_id?: string | null;
          project_name?: string | null;
          recommended_package?: string | null;
          request_type?: string;
          required_systems?: string[];
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          seeking_funding?: boolean | null;
          short_term_goals?: string | null;
          status?: string;
          tender_experience?: boolean | null;
          updated_at?: string;
          urgent_intervention?: string | null;
          user_id?: string;
          website_links?: string | null;
          years_in_operation?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "client_appraisals_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "client_appraisals_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      client_assessments: {
        Row: {
          assessment_date: string;
          client_id: string;
          consultant_id: string | null;
          created_at: string;
          id: string;
          overall_score: number | null;
          status: string;
          summary: string | null;
          updated_at: string;
        };
        Insert: {
          assessment_date?: string;
          client_id: string;
          consultant_id?: string | null;
          created_at?: string;
          id?: string;
          overall_score?: number | null;
          status?: string;
          summary?: string | null;
          updated_at?: string;
        };
        Update: {
          assessment_date?: string;
          client_id?: string;
          consultant_id?: string | null;
          created_at?: string;
          id?: string;
          overall_score?: number | null;
          status?: string;
          summary?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "client_assessments_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      client_challenges: {
        Row: {
          challenge_id: string;
          client_id: string;
          id: string;
          identified_at: string;
          notes: string | null;
          severity: string;
        };
        Insert: {
          challenge_id: string;
          client_id: string;
          id?: string;
          identified_at?: string;
          notes?: string | null;
          severity?: string;
        };
        Update: {
          challenge_id?: string;
          client_id?: string;
          id?: string;
          identified_at?: string;
          notes?: string | null;
          severity?: string;
        };
        Relationships: [
          {
            foreignKeyName: "client_challenges_challenge_id_fkey";
            columns: ["challenge_id"];
            isOneToOne: false;
            referencedRelation: "business_challenges";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "client_challenges_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      client_compliance: {
        Row: {
          available: boolean;
          client_id: string;
          compliance_item_id: string;
          document_id: string | null;
          expiry_date: string | null;
          id: string;
          notes: string | null;
          updated_at: string;
        };
        Insert: {
          available?: boolean;
          client_id: string;
          compliance_item_id: string;
          document_id?: string | null;
          expiry_date?: string | null;
          id?: string;
          notes?: string | null;
          updated_at?: string;
        };
        Update: {
          available?: boolean;
          client_id?: string;
          compliance_item_id?: string;
          document_id?: string | null;
          expiry_date?: string | null;
          id?: string;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "client_compliance_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "client_compliance_compliance_item_id_fkey";
            columns: ["compliance_item_id"];
            isOneToOne: false;
            referencedRelation: "compliance_items";
            referencedColumns: ["id"];
          },
        ];
      };
      client_socials: {
        Row: {
          client_id: string;
          created_at: string;
          id: string;
          platform: string;
          url: string;
        };
        Insert: {
          client_id: string;
          created_at?: string;
          id?: string;
          platform: string;
          url: string;
        };
        Update: {
          client_id?: string;
          created_at?: string;
          id?: string;
          platform?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "client_socials_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      client_systems: {
        Row: {
          client_id: string;
          currently_using: boolean;
          id: string;
          needs_upgrade: boolean;
          notes: string | null;
          system_id: string;
        };
        Insert: {
          client_id: string;
          currently_using?: boolean;
          id?: string;
          needs_upgrade?: boolean;
          notes?: string | null;
          system_id: string;
        };
        Update: {
          client_id?: string;
          currently_using?: boolean;
          id?: string;
          needs_upgrade?: boolean;
          notes?: string | null;
          system_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "client_systems_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "client_systems_system_id_fkey";
            columns: ["system_id"];
            isOneToOne: false;
            referencedRelation: "digital_systems";
            referencedColumns: ["id"];
          },
        ];
      };
      client_users: {
        Row: {
          client_id: string;
          created_at: string;
          id: string;
          is_primary: boolean;
          user_id: string;
        };
        Insert: {
          client_id: string;
          created_at?: string;
          id?: string;
          is_primary?: boolean;
          user_id: string;
        };
        Update: {
          client_id?: string;
          created_at?: string;
          id?: string;
          is_primary?: boolean;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "client_users_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      clients: {
        Row: {
          business_type: string | null;
          client_code: string | null;
          client_type: string;
          company_name: string;
          contact_person: string | null;
          created_at: string;
          created_by: string | null;
          email: string | null;
          employee_count: number | null;
          id: string;
          industry: string | null;
          phone: string | null;
          physical_address: string | null;
          status: string;
          updated_at: string;
          website: string | null;
          years_in_operation: number | null;
        };
        Insert: {
          business_type?: string | null;
          client_code?: string | null;
          client_type?: string;
          company_name: string;
          contact_person?: string | null;
          created_at?: string;
          created_by?: string | null;
          email?: string | null;
          employee_count?: number | null;
          id?: string;
          industry?: string | null;
          phone?: string | null;
          physical_address?: string | null;
          status?: string;
          updated_at?: string;
          website?: string | null;
          years_in_operation?: number | null;
        };
        Update: {
          business_type?: string | null;
          client_code?: string | null;
          client_type?: string;
          company_name?: string;
          contact_person?: string | null;
          created_at?: string;
          created_by?: string | null;
          email?: string | null;
          employee_count?: number | null;
          id?: string;
          industry?: string | null;
          phone?: string | null;
          physical_address?: string | null;
          status?: string;
          updated_at?: string;
          website?: string | null;
          years_in_operation?: number | null;
        };
        Relationships: [];
      };
      compliance_items: {
        Row: {
          category: string | null;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          order_index: number;
        };
        Insert: {
          category?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          order_index?: number;
        };
        Update: {
          category?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          order_index?: number;
        };
        Relationships: [];
      };
      consultation_files: {
        Row: {
          consultation_id: string;
          file_name: string;
          file_url: string;
          id: string;
          uploaded_at: string;
        };
        Insert: {
          consultation_id: string;
          file_name: string;
          file_url: string;
          id?: string;
          uploaded_at?: string;
        };
        Update: {
          consultation_id?: string;
          file_name?: string;
          file_url?: string;
          id?: string;
          uploaded_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "consultation_files_consultation_id_fkey";
            columns: ["consultation_id"];
            isOneToOne: false;
            referencedRelation: "consultations";
            referencedColumns: ["id"];
          },
        ];
      };
      consultations: {
        Row: {
          client_id: string;
          consultant_id: string | null;
          created_at: string;
          id: string;
          location: string | null;
          meeting_date: string;
          meeting_type: string;
          notes: string | null;
          status: string;
        };
        Insert: {
          client_id: string;
          consultant_id?: string | null;
          created_at?: string;
          id?: string;
          location?: string | null;
          meeting_date: string;
          meeting_type?: string;
          notes?: string | null;
          status?: string;
        };
        Update: {
          client_id?: string;
          consultant_id?: string | null;
          created_at?: string;
          id?: string;
          location?: string | null;
          meeting_date?: string;
          meeting_type?: string;
          notes?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "consultations_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      contracts: {
        Row: {
          client_id: string;
          contract_no: string | null;
          created_at: string;
          end_date: string | null;
          id: string;
          pdf_url: string | null;
          proposal_id: string | null;
          signed_at: string | null;
          start_date: string | null;
          status: string;
          title: string;
          value: number;
        };
        Insert: {
          client_id: string;
          contract_no?: string | null;
          created_at?: string;
          end_date?: string | null;
          id?: string;
          pdf_url?: string | null;
          proposal_id?: string | null;
          signed_at?: string | null;
          start_date?: string | null;
          status?: string;
          title: string;
          value?: number;
        };
        Update: {
          client_id?: string;
          contract_no?: string | null;
          created_at?: string;
          end_date?: string | null;
          id?: string;
          pdf_url?: string | null;
          proposal_id?: string | null;
          signed_at?: string | null;
          start_date?: string | null;
          status?: string;
          title?: string;
          value?: number;
        };
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contracts_proposal_id_fkey";
            columns: ["proposal_id"];
            isOneToOne: false;
            referencedRelation: "proposals";
            referencedColumns: ["id"];
          },
        ];
      };
      digital_systems: {
        Row: {
          category: string | null;
          description: string | null;
          id: string;
          name: string;
        };
        Insert: {
          category?: string | null;
          description?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          category?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          category: string;
          client_id: string | null;
          file_name: string;
          file_size: number | null;
          file_url: string;
          id: string;
          is_branded: boolean;
          mime_type: string | null;
          project_id: string | null;
          title: string | null;
          uploaded_at: string;
          uploaded_by: string | null;
        };
        Insert: {
          category: string;
          client_id?: string | null;
          file_name: string;
          file_size?: number | null;
          file_url: string;
          id?: string;
          is_branded?: boolean;
          mime_type?: string | null;
          project_id?: string | null;
          title?: string | null;
          uploaded_at?: string;
          uploaded_by?: string | null;
        };
        Update: {
          category?: string;
          client_id?: string | null;
          file_name?: string;
          file_size?: number | null;
          file_url?: string;
          id?: string;
          is_branded?: boolean;
          mime_type?: string | null;
          project_id?: string | null;
          title?: string | null;
          uploaded_at?: string;
          uploaded_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      expenses: {
        Row: {
          amount: number;
          category: string | null;
          client_id: string | null;
          created_at: string;
          description: string;
          expense_date: string;
          id: string;
          project_id: string | null;
          receipt_url: string | null;
          recorded_by: string | null;
        };
        Insert: {
          amount?: number;
          category?: string | null;
          client_id?: string | null;
          created_at?: string;
          description: string;
          expense_date?: string;
          id?: string;
          project_id?: string | null;
          receipt_url?: string | null;
          recorded_by?: string | null;
        };
        Update: {
          amount?: number;
          category?: string | null;
          client_id?: string | null;
          created_at?: string;
          description?: string;
          expense_date?: string;
          id?: string;
          project_id?: string | null;
          receipt_url?: string | null;
          recorded_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "expenses_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expenses_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      investment_opportunities: {
        Row: {
          client_id: string;
          created_at: string;
          currency: string;
          id: string;
          matched_investor_id: string | null;
          purpose: string | null;
          readiness_score: number | null;
          required_amount: number | null;
          status: string;
        };
        Insert: {
          client_id: string;
          created_at?: string;
          currency?: string;
          id?: string;
          matched_investor_id?: string | null;
          purpose?: string | null;
          readiness_score?: number | null;
          required_amount?: number | null;
          status?: string;
        };
        Update: {
          client_id?: string;
          created_at?: string;
          currency?: string;
          id?: string;
          matched_investor_id?: string | null;
          purpose?: string | null;
          readiness_score?: number | null;
          required_amount?: number | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "investment_opportunities_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "investment_opportunities_matched_investor_id_fkey";
            columns: ["matched_investor_id"];
            isOneToOne: false;
            referencedRelation: "investors";
            referencedColumns: ["id"];
          },
        ];
      };
      investors: {
        Row: {
          created_at: string;
          email: string | null;
          focus_area: string | null;
          id: string;
          name: string;
          notes: string | null;
          organization: string | null;
          phone: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          focus_area?: string | null;
          id?: string;
          name: string;
          notes?: string | null;
          organization?: string | null;
          phone?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          focus_area?: string | null;
          id?: string;
          name?: string;
          notes?: string | null;
          organization?: string | null;
          phone?: string | null;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          amount: number;
          client_id: string;
          contract_id: string | null;
          created_at: string;
          currency: string;
          due_date: string | null;
          id: string;
          invoice_no: string | null;
          issued_at: string;
          pdf_url: string | null;
          project_id: string | null;
          status: string;
          total: number;
          vat: number;
        };
        Insert: {
          amount?: number;
          client_id: string;
          contract_id?: string | null;
          created_at?: string;
          currency?: string;
          due_date?: string | null;
          id?: string;
          invoice_no?: string | null;
          issued_at?: string;
          pdf_url?: string | null;
          project_id?: string | null;
          status?: string;
          total?: number;
          vat?: number;
        };
        Update: {
          amount?: number;
          client_id?: string;
          contract_id?: string | null;
          created_at?: string;
          currency?: string;
          due_date?: string | null;
          id?: string;
          invoice_no?: string | null;
          issued_at?: string;
          pdf_url?: string | null;
          project_id?: string | null;
          status?: string;
          total?: number;
          vat?: number;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_contract_id_fkey";
            columns: ["contract_id"];
            isOneToOne: false;
            referencedRelation: "contracts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      isolated_services: {
        Row: {
          category: string;
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          order_index: number;
          price_range: string | null;
          updated_at: string;
        };
        Insert: {
          category?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          order_index?: number;
          price_range?: string | null;
          updated_at?: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          order_index?: number;
          price_range?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      kpis: {
        Row: {
          client_id: string;
          current_value: number | null;
          id: string;
          metric_name: string;
          period: string | null;
          target: number | null;
          unit: string | null;
          updated_at: string;
        };
        Insert: {
          client_id: string;
          current_value?: number | null;
          id?: string;
          metric_name: string;
          period?: string | null;
          target?: number | null;
          unit?: string | null;
          updated_at?: string;
        };
        Update: {
          client_id?: string;
          current_value?: number | null;
          id?: string;
          metric_name?: string;
          period?: string | null;
          target?: number | null;
          unit?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "kpis_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      lead_activities: {
        Row: {
          activity_date: string;
          activity_type: string;
          id: string;
          lead_id: string;
          notes: string | null;
          performed_by: string | null;
        };
        Insert: {
          activity_date?: string;
          activity_type: string;
          id?: string;
          lead_id: string;
          notes?: string | null;
          performed_by?: string | null;
        };
        Update: {
          activity_date?: string;
          activity_type?: string;
          id?: string;
          lead_id?: string;
          notes?: string | null;
          performed_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      leads: {
        Row: {
          assigned_to: string | null;
          company: string | null;
          converted_client_id: string | null;
          created_at: string;
          email: string | null;
          id: string;
          name: string;
          notes: string | null;
          phone: string | null;
          source: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          assigned_to?: string | null;
          company?: string | null;
          converted_client_id?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name: string;
          notes?: string | null;
          phone?: string | null;
          source?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          assigned_to?: string | null;
          company?: string | null;
          converted_client_id?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string;
          notes?: string | null;
          phone?: string | null;
          source?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "leads_converted_client_id_fkey";
            columns: ["converted_client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string;
          id: string;
          link: string | null;
          message: string;
          notification_type: string;
          read_status: boolean;
          title: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          link?: string | null;
          message: string;
          notification_type?: string;
          read_status?: boolean;
          title: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          link?: string | null;
          message?: string;
          notification_type?: string;
          read_status?: boolean;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      objectives: {
        Row: {
          client_id: string;
          created_at: string;
          description: string;
          id: string;
          objective_type: string;
          priority: string;
          status: string;
          target_date: string | null;
        };
        Insert: {
          client_id: string;
          created_at?: string;
          description: string;
          id?: string;
          objective_type: string;
          priority?: string;
          status?: string;
          target_date?: string | null;
        };
        Update: {
          client_id?: string;
          created_at?: string;
          description?: string;
          id?: string;
          objective_type?: string;
          priority?: string;
          status?: string;
          target_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objectives_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      package_services: {
        Row: {
          id: string;
          order_index: number;
          package_id: string;
          service_name: string;
        };
        Insert: {
          id?: string;
          order_index?: number;
          package_id: string;
          service_name: string;
        };
        Update: {
          id?: string;
          order_index?: number;
          package_id?: string;
          service_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "package_services_package_id_fkey";
            columns: ["package_id"];
            isOneToOne: false;
            referencedRelation: "packages";
            referencedColumns: ["id"];
          },
        ];
      };
      packages: {
        Row: {
          base_price: number;
          category: string | null;
          created_at: string;
          currency: string;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
        };
        Insert: {
          base_price?: number;
          category?: string | null;
          created_at?: string;
          currency?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
        };
        Update: {
          base_price?: number;
          category?: string | null;
          created_at?: string;
          currency?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          amount: number;
          id: string;
          invoice_id: string;
          notes: string | null;
          payment_date: string;
          payment_method: string | null;
          recorded_by: string | null;
          reference: string | null;
        };
        Insert: {
          amount: number;
          id?: string;
          invoice_id: string;
          notes?: string | null;
          payment_date?: string;
          payment_method?: string | null;
          recorded_by?: string | null;
          reference?: string | null;
        };
        Update: {
          amount?: number;
          id?: string;
          invoice_id?: string;
          notes?: string | null;
          payment_date?: string;
          payment_method?: string | null;
          recorded_by?: string | null;
          reference?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          city: string | null;
          contact_email: string;
          country: string | null;
          created_at: string;
          display_name: string;
          entity_type: Database["public"]["Enums"]["entity_type"];
          full_name: string | null;
          id: string;
          phone: string | null;
          sector: string | null;
          stage: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          city?: string | null;
          contact_email: string;
          country?: string | null;
          created_at?: string;
          display_name: string;
          entity_type?: Database["public"]["Enums"]["entity_type"];
          full_name?: string | null;
          id: string;
          phone?: string | null;
          sector?: string | null;
          stage?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          city?: string | null;
          contact_email?: string;
          country?: string | null;
          created_at?: string;
          display_name?: string;
          entity_type?: Database["public"]["Enums"]["entity_type"];
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          sector?: string | null;
          stage?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_members: {
        Row: {
          assigned_at: string;
          assigned_by: string | null;
          id: string;
          project_id: string;
          role_on_project: string;
          user_id: string;
        };
        Insert: {
          assigned_at?: string;
          assigned_by?: string | null;
          id?: string;
          project_id: string;
          role_on_project?: string;
          user_id: string;
        };
        Update: {
          assigned_at?: string;
          assigned_by?: string | null;
          id?: string;
          project_id?: string;
          role_on_project?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      project_messages: {
        Row: {
          body: string | null;
          created_at: string;
          document_id: string | null;
          id: string;
          project_id: string;
          sender_id: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          document_id?: string | null;
          id?: string;
          project_id: string;
          sender_id: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          document_id?: string | null;
          id?: string;
          project_id?: string;
          sender_id?: string;
        };
        Relationships: [];
      };
      project_milestones: {
        Row: {
          completed_at: string | null;
          description: string | null;
          due_date: string | null;
          id: string;
          order_index: number;
          project_id: string;
          status: string;
          title: string;
        };
        Insert: {
          completed_at?: string | null;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          order_index?: number;
          project_id: string;
          status?: string;
          title: string;
        };
        Update: {
          completed_at?: string | null;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          order_index?: number;
          project_id?: string;
          status?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      project_tasks: {
        Row: {
          assigned_to: string | null;
          completed_at: string | null;
          created_at: string;
          deadline: string | null;
          description: string | null;
          id: string;
          milestone_id: string | null;
          priority: string;
          project_id: string;
          status: string;
          task_name: string;
        };
        Insert: {
          assigned_to?: string | null;
          completed_at?: string | null;
          created_at?: string;
          deadline?: string | null;
          description?: string | null;
          id?: string;
          milestone_id?: string | null;
          priority?: string;
          project_id: string;
          status?: string;
          task_name: string;
        };
        Update: {
          assigned_to?: string | null;
          completed_at?: string | null;
          created_at?: string;
          deadline?: string | null;
          description?: string | null;
          id?: string;
          milestone_id?: string | null;
          priority?: string;
          project_id?: string;
          status?: string;
          task_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_tasks_milestone_id_fkey";
            columns: ["milestone_id"];
            isOneToOne: false;
            referencedRelation: "project_milestones";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          client_id: string;
          contract_id: string | null;
          created_at: string;
          description: string | null;
          end_date: string | null;
          estimated_duration_days: number | null;
          id: string;
          manager_id: string | null;
          progress_percent: number;
          project_name: string;
          project_no: string | null;
          start_date: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          client_id: string;
          contract_id?: string | null;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          estimated_duration_days?: number | null;
          id?: string;
          manager_id?: string | null;
          progress_percent?: number;
          project_name: string;
          project_no?: string | null;
          start_date?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          client_id?: string;
          contract_id?: string | null;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          estimated_duration_days?: number | null;
          id?: string;
          manager_id?: string | null;
          progress_percent?: number;
          project_name?: string;
          project_no?: string | null;
          start_date?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "projects_contract_id_fkey";
            columns: ["contract_id"];
            isOneToOne: false;
            referencedRelation: "contracts";
            referencedColumns: ["id"];
          },
        ];
      };
      proposal_items: {
        Row: {
          id: string;
          order_index: number;
          proposal_id: string;
          quantity: number;
          service_name: string;
          total: number;
          unit_price: number;
        };
        Insert: {
          id?: string;
          order_index?: number;
          proposal_id: string;
          quantity?: number;
          service_name: string;
          total?: number;
          unit_price?: number;
        };
        Update: {
          id?: string;
          order_index?: number;
          proposal_id?: string;
          quantity?: number;
          service_name?: string;
          total?: number;
          unit_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "proposal_items_proposal_id_fkey";
            columns: ["proposal_id"];
            isOneToOne: false;
            referencedRelation: "proposals";
            referencedColumns: ["id"];
          },
        ];
      };
      proposals: {
        Row: {
          amount: number;
          approved_at: string | null;
          client_id: string;
          created_at: string;
          created_by: string | null;
          currency: string;
          id: string;
          pdf_url: string | null;
          proposal_no: string | null;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          amount?: number;
          approved_at?: string | null;
          client_id: string;
          created_at?: string;
          created_by?: string | null;
          currency?: string;
          id?: string;
          pdf_url?: string | null;
          proposal_no?: string | null;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          approved_at?: string | null;
          client_id?: string;
          created_at?: string;
          created_by?: string | null;
          currency?: string;
          id?: string;
          pdf_url?: string | null;
          proposal_no?: string | null;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "proposals_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      reports: {
        Row: {
          client_id: string;
          created_at: string;
          file_url: string | null;
          generated_by: string | null;
          id: string;
          period: string | null;
          report_type: string;
          summary: string | null;
          title: string;
        };
        Insert: {
          client_id: string;
          created_at?: string;
          file_url?: string | null;
          generated_by?: string | null;
          id?: string;
          period?: string | null;
          report_type: string;
          summary?: string | null;
          title: string;
        };
        Update: {
          client_id?: string;
          created_at?: string;
          file_url?: string | null;
          generated_by?: string | null;
          id?: string;
          period?: string | null;
          report_type?: string;
          summary?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reports_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      retainers: {
        Row: {
          client_id: string;
          created_at: string;
          currency: string;
          end_date: string | null;
          id: string;
          monthly_fee: number;
          package_id: string | null;
          start_date: string;
          status: string;
        };
        Insert: {
          client_id: string;
          created_at?: string;
          currency?: string;
          end_date?: string | null;
          id?: string;
          monthly_fee?: number;
          package_id?: string | null;
          start_date: string;
          status?: string;
        };
        Update: {
          client_id?: string;
          created_at?: string;
          currency?: string;
          end_date?: string | null;
          id?: string;
          monthly_fee?: number;
          package_id?: string | null;
          start_date?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "retainers_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "retainers_package_id_fkey";
            columns: ["package_id"];
            isOneToOne: false;
            referencedRelation: "packages";
            referencedColumns: ["id"];
          },
        ];
      };
      team_members: {
        Row: {
          bio: string | null;
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          is_active: boolean;
          is_ceo: boolean;
          linkedin_url: string | null;
          order_index: number;
          photo_url: string | null;
          title: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          bio?: string | null;
          created_at?: string;
          email?: string | null;
          full_name: string;
          id?: string;
          is_active?: boolean;
          is_ceo?: boolean;
          linkedin_url?: string | null;
          order_index?: number;
          photo_url?: string | null;
          title?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          bio?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          is_active?: boolean;
          is_ceo?: boolean;
          linkedin_url?: string | null;
          order_index?: number;
          photo_url?: string | null;
          title?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      tender_documents: {
        Row: {
          created_at: string;
          document_id: string | null;
          document_name: string | null;
          id: string;
          tender_id: string;
        };
        Insert: {
          created_at?: string;
          document_id?: string | null;
          document_name?: string | null;
          id?: string;
          tender_id: string;
        };
        Update: {
          created_at?: string;
          document_id?: string | null;
          document_name?: string | null;
          id?: string;
          tender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tender_documents_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tender_documents_tender_id_fkey";
            columns: ["tender_id"];
            isOneToOne: false;
            referencedRelation: "tenders";
            referencedColumns: ["id"];
          },
        ];
      };
      tender_submissions: {
        Row: {
          created_at: string;
          id: string;
          notes: string | null;
          result: string | null;
          submitted_by: string | null;
          submitted_date: string | null;
          tender_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          notes?: string | null;
          result?: string | null;
          submitted_by?: string | null;
          submitted_date?: string | null;
          tender_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          notes?: string | null;
          result?: string | null;
          submitted_by?: string | null;
          submitted_date?: string | null;
          tender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tender_submissions_tender_id_fkey";
            columns: ["tender_id"];
            isOneToOne: false;
            referencedRelation: "tenders";
            referencedColumns: ["id"];
          },
        ];
      };
      tenders: {
        Row: {
          client_id: string | null;
          closing_date: string | null;
          created_at: string;
          id: string;
          notes: string | null;
          organization: string | null;
          reference_no: string | null;
          status: string;
          title: string;
          value_estimate: number | null;
        };
        Insert: {
          client_id?: string | null;
          closing_date?: string | null;
          created_at?: string;
          id?: string;
          notes?: string | null;
          organization?: string | null;
          reference_no?: string | null;
          status?: string;
          title: string;
          value_estimate?: number | null;
        };
        Update: {
          client_id?: string | null;
          closing_date?: string | null;
          created_at?: string;
          id?: string;
          notes?: string | null;
          organization?: string | null;
          reference_no?: string | null;
          status?: string;
          title?: string;
          value_estimate?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "tenders_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      team_members_public: {
        Row: {
          bio: string | null;
          created_at: string | null;
          full_name: string | null;
          id: string | null;
          is_active: boolean | null;
          is_ceo: boolean | null;
          linkedin_url: string | null;
          order_index: number | null;
          photo_url: string | null;
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          bio?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id?: string | null;
          is_active?: boolean | null;
          is_ceo?: boolean | null;
          linkedin_url?: string | null;
          order_index?: number | null;
          photo_url?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          bio?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id?: string | null;
          is_active?: boolean | null;
          is_ceo?: boolean | null;
          linkedin_url?: string | null;
          order_index?: number | null;
          photo_url?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      can_access_client: { Args: { _client_id: string }; Returns: boolean };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_staff: { Args: { _user_id: string }; Returns: boolean };
    };
    Enums: {
      app_role:
        | "admin"
        | "team"
        | "client"
        | "super_admin"
        | "ceo"
        | "consultant"
        | "ops_manager"
        | "project_manager"
        | "hr_officer"
        | "finance_officer"
        | "client_user";
      entity_type:
        | "individual"
        | "informal_group"
        | "registered_company"
        | "company_representative"
        | "public_institution"
        | "other";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "team",
        "client",
        "super_admin",
        "ceo",
        "consultant",
        "ops_manager",
        "project_manager",
        "hr_officer",
        "finance_officer",
        "client_user",
      ],
      entity_type: [
        "individual",
        "informal_group",
        "registered_company",
        "company_representative",
        "public_institution",
        "other",
      ],
    },
  },
} as const;
