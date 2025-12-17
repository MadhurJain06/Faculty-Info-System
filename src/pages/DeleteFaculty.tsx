import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Trash2, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Faculty {
  faculty_id: number;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone: string;
}

export default function DeleteFaculty() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching faculty:', error);
        alert('Error loading faculty: ' + error.message);
        setFaculty([]);
      } else {
        setFaculty(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Unexpected error loading faculty');
      setFaculty([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (facultyId: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const { error } = await supabase
        .from('faculty')
        .delete()
        .match({ faculty_id: facultyId });

      if (error) {
        console.error('Error deleting faculty:', error);
        alert('Error deleting faculty: ' + error.message);
      } else {
        alert('Faculty deleted successfully!');
        await fetchFaculty();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Unexpected error deleting faculty');
    }
  };

  const filteredFaculty = faculty.filter(f =>
    f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Delete Faculty
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Remove faculty members from the system
        </p>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredFaculty.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">No faculty members found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredFaculty.map((member) => (
              <div
                key={member.faculty_id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {member.designation}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                      <span className="font-medium mr-2">Department:</span>
                      {member.department}
                    </span>
                    <span className="flex items-center">
                      <span className="font-medium mr-2">Email:</span>
                      {member.email}
                    </span>
                    <span className="flex items-center">
                      <span className="font-medium mr-2">Phone:</span>
                      {member.phone}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(member.faculty_id, member.name)}
                  className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}