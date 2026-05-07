import { supabase } from './supabase';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface CreateContactInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function submitContactMessage(input: CreateContactInput): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('contact_messages').insert({
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      message: input.message,
    });

    if (error) {
      console.error('Error submitting contact message:', error);
      return { success: false, error: 'Failed to send message' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting contact message:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact messages:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return [];
  }
}

export async function markMessageAsRead(messageId: string): Promise<void> {
  try {
    await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', messageId);
  } catch (error) {
    console.error('Error marking message as read:', error);
  }
}

export async function getUnreadMessageCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);

    if (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}
