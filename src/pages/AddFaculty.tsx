// src/pages/AddFaculty.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  departmentService, 
  courseService, 
  facultyService, 
  officeService,
  Department, 
  Course,
  Office 
} from '../config/supabase';

export default function AddFaculty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department_id: '',
    office_id: '',
    designation: '',
    qualification: '',
    profile_link: ''
  });

  // Load departments, courses, and offices on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Filter courses when department changes
  useEffect(() => {
    if (formData.department_id) {
      const deptId = parseInt(formData.department_id);
      const filtered = courses.filter(course => course.department_id === deptId);
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
  }, [formData.department_id, courses]);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      console.log('Loading departments, courses, and offices...');
      
      // Load all data in parallel
      const [depts, coursesData, officesData] = await Promise.all([
        departmentService.getAll(),
        courseService.getAll(),
        officeService.getAll()
      ]);
      
      console.log('Loaded departments:', depts);
      console.log('Loaded courses:', coursesData);
      console.log('Loaded offices:', officesData);
      
      setDepartments(depts);
      setCourses(coursesData);
      setOffices(officesData);
      
      if (depts.length === 0) {
        console.warn('No departments found in database!');
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading form data. Please check console for details.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.department_id) {
      alert('Please fill in all required fields (Name, Email, Department)');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      const facultyData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        department_id: parseInt(formData.department_id),
        office_id: formData.office_id ? parseInt(formData.office_id) : null,
        designation: formData.designation || null,
        qualification: formData.qualification || null,
        profile_link: formData.profile_link || null
      };

      console.log('Submitting faculty data:', facultyData);
      
      const result = await facultyService.add(facultyData);
      
      if (result) {
        alert('✅ Faculty added successfully!');
        navigate('/faculty');
      }
      
    } catch (error) {
      console.error('Error adding faculty:', error);
      
      // Better error messages
      if (error.code === '23505') {
        alert('❌ Error: This email is already registered.');
      } else if (error.message) {
        alert(`❌ Error: ${error.message}`);
      } else {
        alert('❌ Error adding faculty. Please check console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Add New Faculty</h1>
          <button
            onClick={() => navigate('/faculty')}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {departments.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 font-medium">
              ⚠️ No departments found in database!
            </p>
            <p className="text-yellow-700 text-sm mt-1">
              Please run the SQL schema in Supabase SQL Editor first.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Dr. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john.doe@college.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Link
                </label>
                <input
                  type="url"
                  name="profile_link"
                  value={formData.profile_link}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://college.edu/faculty/profile"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Academic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {departments.length} department(s) available
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Office Location
                </label>
                <select
                  name="office_id"
                  value={formData.office_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Office (Optional)</option>
                  {offices.map((office) => (
                    <option key={office.office_id} value={office.office_id}>
                      {office.room_number} - {office.block} ({office.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation
                </label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Designation</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Senior Lecturer">Senior Lecturer</option>
                  <option value="Visiting Faculty">Visiting Faculty</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ph.D. Computer Science, M.Tech"
                />
              </div>
            </div>
          </div>

          {/* Related Courses Info (Display Only) */}
          {formData.department_id && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                📚 Courses in Selected Department
              </h3>
              {filteredCourses.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {filteredCourses.map((course) => (
                    <span
                      key={course.course_id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {course.course_code} - {course.course_name} ({course.credits} credits)
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-blue-700">No courses found for this department.</p>
              )}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || departments.length === 0}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Faculty...
                </span>
              ) : (
                'Add Faculty'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/faculty')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Debug Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 font-mono">
            Status: {departments.length} departments | {courses.length} courses | {offices.length} offices loaded
          </p>
        </div>
      </div>
    </div>
  );
}