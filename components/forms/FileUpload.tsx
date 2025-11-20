import { Upload } from "lucide-react";

export default function FileUpload() {
  return (
    <div>
      <label className="text-sm font-semibold text-black flex gap-2">
        Resume / Cover Letter
      </label>
      <p className="text-gray-500 text-xs py-2">
        The uploaded files will be used to customize your interview practice.
      </p>

      <div className="w-full p-4 border border-dashed border-gray-300 rounded-lg cursor-pointer flex gap-3 items-center bg-white hover:bg-gray-50">
        <Upload className="text-gray-500 w-5 h-5" />
        <span className="text-gray-500 text-sm">
          Upload up to 2 files (.pdf, .docx) — Max 10MB each
        </span>
      </div>

      <input type="file" multiple accept=".pdf,.docx" className="hidden" />
    </div>
  );
}
