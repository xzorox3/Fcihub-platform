// Utility functions for Admin Dashboard

export const exportToCSV = (data, filename) => {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const convertToCSV = (data) => {
  if (!data || data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape quotes and wrap in quotes if necessary
          return typeof value === "string" && value.includes(",")
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        })
        .join(",")
    ),
  ];

  return csvRows.join("\n");
};

export const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileTypeColor = (type) => {
  const colors = {
    pdf: "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400",
    video:
      "text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400",
    book: "text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400",
    exam: "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400",
  };
  return colors[type] || colors.pdf;
};

export const generateDoctorReport = (doctors) => {
  return doctors.map((doctor) => ({
    Name: doctor.name,
    Email: doctor.email,
    Department: doctor.department,
    "Join Date": doctor.joinDate,
    "Last Activity": doctor.lastActivity,
    "Total PDFs": doctor.uploads.pdfs,
    "Total Books": doctor.uploads.books,
    "Total Exams": doctor.uploads.exams,
    "Total Videos": doctor.uploads.videos,
    "Total Uploads":
      doctor.uploads.pdfs +
      doctor.uploads.books +
      doctor.uploads.exams +
      doctor.uploads.videos,
    Status: doctor.status,
  }));
};

export const generateUploadsReport = (uploads) => {
  return uploads.map((upload) => ({
    "File Name": upload.name,
    Type: upload.type.toUpperCase(),
    Doctor: upload.doctor,
    Department: upload.department,
    Course: upload.course,
    "Upload Date": upload.uploadDate,
    Size: upload.size,
    Downloads: upload.downloads,
    Status: upload.status,
  }));
};
