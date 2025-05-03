import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import {
  getProfile,
  trackLoginAndAddCredits,
  upadteProfile,
} from "../services/services";
import { getUserId } from "../services/axiosClient";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, "Must be at least 10 digits")
      .max(15, "Must be 15 digits or less"),
    address: Yup.string().max(200, "Address too long"),
    bio: Yup.string().max(500, "Bio too long"),
    education: Yup.object().shape({
      degree: Yup.string().max(100, "Degree name too long"),
      university: Yup.string().max(100, "University name too long"),
      graduationYear: Yup.number()
        .min(1900, "Year must be after 1900")
        .max(new Date().getFullYear() + 5, "Year is in the future"),
    }),
    linkedin: Yup.string().url("Invalid LinkedIn URL"),
    github: Yup.string().url("Invalid GitHub URL"),
    website: Yup.string().url("Invalid Website URL"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      bio: "",
      education: {
        degree: "",
        university: "",
        graduationYear: "",
      },
      linkedin: "",
      github: "",
      website: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const payLoad = {
          ...values,
          profileCompleted: true,
        };

        const response = await upadteProfile(payLoad);

        if (response?.data?.data) {
          trackLoginAndAddCredits().then((res) => {
            toast.success(
              "Your Profile is Updated and you are Getting 50Points"
            );
          });
          setProfile(response.data.data);
          setIsEditing(false);
        }
        // Mock success for now
        setIsEditing(false);
      } catch (err) {
        console.error("Error updating profile:", err);
        setError("Failed to update profile");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        console.log(response);
        if (response?.data?.data) {
          const profileData = response.data.data;
          setProfile(profileData);
          // Set Formik initial values
          formik.setValues({
            name: profileData.name || "",
            email: profileData.email || "",
            phone: profileData.phone || "",
            address: profileData.address || "",
            bio: profileData.bio || "",
            education: {
              degree: profileData.education?.degree || "",
              university: profileData.education?.university || "",
              graduationYear: profileData.education?.graduationYear || "",
            },
            linkedin: profileData.linkedin || "",
            github: profileData.github || "",
            website: profileData.website || "",
          });
        } else {
          setError("Profile data not found");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original profile data
    if (profile) {
      formik.setValues({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        bio: profile.bio || "",
        education: {
          degree: profile.education?.degree || "",
          university: profile.education?.university || "",
          graduationYear: profile.education?.graduationYear || "",
        },
        linkedin: profile.linkedin || "",
        github: profile.github || "",
        website: profile.website || "",
      });
    }
    formik.resetForm();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p>No profile data available</p>
      </div>
    );
  }

  return (
    <div className="  justify-center bg-gradient-to-br from-rose-100 to-teal-100 p-4">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-teal-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`text-2xl font-bold ${
                        formik.touched.name && formik.errors.name
                          ? "border-red-500"
                          : "border-teal-700"
                      } bg-teal-700 text-white p-1 rounded w-full`}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className="text-red-200 text-sm mt-1">
                        {formik.errors.name}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <h1 className="text-2xl font-bold">
                    {profile.name || "User"}
                  </h1>
                )}
                {isEditing ? (
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`${
                        formik.touched.email && formik.errors.email
                          ? "border-red-500"
                          : "border-teal-700"
                      } bg-teal-700 text-white p-1 rounded w-full`}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-200 text-sm mt-1">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-teal-100">
                    {profile.email || "No email provided"}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={formik.handleSubmit}
                      className="p-2 bg-teal-700 rounded-full hover:bg-teal-800 transition-colors"
                      aria-label="Save profile"
                      disabled={loading || !formik.isValid}
                    >
                      <FaSave className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                      aria-label="Cancel editing"
                      disabled={loading}
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-teal-700 rounded-full hover:bg-teal-800 transition-colors"
                    aria-label="Edit profile"
                  >
                    <FaEdit className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Profile Content */}
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={formik.handleSubmit}>
                {/* Basic Info Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500 block">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full p-2 border rounded ${
                          formik.touched.phone && formik.errors.phone
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {formik.touched.phone && formik.errors.phone ? (
                        <div className="text-red-500 text-xs mt-1">
                          {formik.errors.phone}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full p-2 border rounded ${
                          formik.touched.address && formik.errors.address
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {formik.touched.address && formik.errors.address ? (
                        <div className="text-red-500 text-xs mt-1">
                          {formik.errors.address}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    About
                  </h2>
                  <textarea
                    name="bio"
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-2 border rounded h-32 ${
                      formik.touched.bio && formik.errors.bio
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Tell us about yourself..."
                  />
                  {formik.touched.bio && formik.errors.bio ? (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.bio}
                    </div>
                  ) : null}
                </div>

                {/* Education Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Education
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 block">
                        Degree
                      </label>
                      <input
                        type="text"
                        name="education.degree"
                        value={formik.values.education.degree}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full p-2 border rounded ${
                          formik.touched.education?.degree &&
                          formik.errors.education?.degree
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {formik.touched.education?.degree &&
                      formik.errors.education?.degree ? (
                        <div className="text-red-500 text-xs mt-1">
                          {formik.errors.education.degree}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block">
                        University
                      </label>
                      <input
                        type="text"
                        name="education.university"
                        value={formik.values.education.university}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full p-2 border rounded ${
                          formik.touched.education?.university &&
                          formik.errors.education?.university
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {formik.touched.education?.university &&
                      formik.errors.education?.university ? (
                        <div className="text-red-500 text-xs mt-1">
                          {formik.errors.education.university}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block">
                        Graduation Year
                      </label>
                      <input
                        type="number"
                        name="education.graduationYear"
                        value={formik.values.education.graduationYear}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full p-2 border rounded ${
                          formik.touched.education?.graduationYear &&
                          formik.errors.education?.graduationYear
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {formik.touched.education?.graduationYear &&
                      formik.errors.education?.graduationYear ? (
                        <div className="text-red-500 text-xs mt-1">
                          {formik.errors.education.graduationYear}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Connect
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 block">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formik.values.linkedin}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full p-2 border rounded ${
                          formik.touched.linkedin && formik.errors.linkedin
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="https://linkedin.com/in/username"
                      />
                      {formik.touched.linkedin && formik.errors.linkedin ? (
                        <div className="text-red-500 text-xs mt-1">
                          {formik.errors.linkedin}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        name="github"
                        value={formik.values.github}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full p-2 border rounded ${
                          formik.touched.github && formik.errors.github
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="https://github.com/username"
                      />
                      {formik.touched.github && formik.errors.github ? (
                        <div className="text-red-500 text-xs mt-1">
                          {formik.errors.github}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block">
                        Website URL
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formik.values.website}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full p-2 border rounded ${
                          formik.touched.website && formik.errors.website
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="https://yourwebsite.com"
                      />
                      {formik.touched.website && formik.errors.website ? (
                        <div className="text-red-500 text-xs mt-1">
                          {formik.errors.website}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors disabled:opacity-50"
                    disabled={loading || !formik.isValid || !formik.dirty}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Basic Info Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="capitalize">{profile.role || "user"}</p>
                    </div>

                    {profile.phone && (
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p>{profile.phone}</p>
                      </div>
                    )}
                    {profile.address && (
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p>{profile.address}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p>
                        {profile.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                {profile.bio && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                      About
                    </h2>
                    <p className="text-gray-700 whitespace-pre-line">
                      {profile.bio}
                    </p>
                  </div>
                )}

                {/* Education Section */}
                {profile.education &&
                  (profile.education.degree ||
                    profile.education.university) && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Education
                      </h2>
                      <div className="space-y-2">
                        {profile.education.degree && (
                          <p className="font-medium">
                            {profile.education.degree}
                          </p>
                        )}
                        {profile.education.university && (
                          <p>{profile.education.university}</p>
                        )}
                        {profile.education.graduationYear && (
                          <p className="text-gray-600">
                            Graduated in {profile.education.graduationYear}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                {/* Social Links */}
                {(profile.linkedin || profile.github || profile.website) && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                      Connect
                    </h2>
                    <div className="flex flex-wrap gap-4">
                      {profile.linkedin && (
                        <a
                          href={
                            profile.linkedin.startsWith("http")
                              ? profile.linkedin
                              : `https://${profile.linkedin}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
                        >
                          <FaLinkedin className="mr-2" size={20} />
                          LinkedIn
                        </a>
                      )}
                      {profile.github && (
                        <a
                          href={
                            profile.github.startsWith("http")
                              ? profile.github
                              : `https://${profile.github}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
                        >
                          <FaGithub className="mr-2" size={20} />
                          GitHub
                        </a>
                      )}
                      {profile.website && (
                        <a
                          href={
                            profile.website.startsWith("http")
                              ? profile.website
                              : `https://${profile.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-teal-700 hover:text-teal-900 transition-colors"
                        >
                          <FaGlobe className="mr-2" size={20} />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Activity Section */}
                {profile.activities?.length > 0 ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                      Recent Activity
                    </h2>
                    <div className="space-y-2">
                      {profile.activities.slice(0, 5).map((activity) => (
                        <div
                          key={activity._id}
                          className="border-b pb-2 last:border-b-0"
                        >
                          <p className="text-sm text-gray-600">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    No recent activity to display
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
