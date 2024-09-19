import React, { useState, useRef } from "react";
import { Button, Modal } from "antd";
import { FaCamera, FaCheck, FaSave, FaRedo } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const UploadSelfieModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal
      title={<div className="text-center">Take a selfie</div>}
      open={open}
      onCancel={onClose}
      onOk={onConfirm}
      closable={false}
      footer={null}
      destroyOnClose={true}
    >
      <UploadSelfie onClose={onClose} onConfirm={onConfirm} />
    </Modal>
  );
};
export { UploadSelfieModal };

const UploadSelfie = ({ onClose, onConfirm }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const axiosSecure = useAxiosSecure();

  const openCamera = () => {
    setIsCameraOpen(true);
    setImageSrc(null);
    setIsImageUploaded(false);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing camera: ", err));
  };

  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/png");
      setImageSrc(dataURL);

      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
      setIsCameraOpen(false);
    }
  };

  const handleSave = async () => {
    if (!imageSrc) return;

    const response = await fetch(imageSrc);
    const blob = await response.blob();
    const file = new File([blob], "selfie.png", { type: "image/png" });

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const uploadResponse = await axiosSecure.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (uploadResponse.data.success) {
        setIsImageUploaded(true);
        onConfirm(uploadResponse.data.imageUrl);
      } else {
        console.error("Image upload failed:", uploadResponse.data.msg);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetCamera = () => {
    openCamera();
  };

  return (
    <div className="flex flex-col items-center min-h-[360px]">
      {!isCameraOpen ? (
        <>
          {imageSrc ? (
            <div className="flex flex-col items-center mt-4">
              <img
                src={imageSrc}
                alt="Captured Selfie"
                className="w-full max-w-[480px] rounded-lg"
              />
            </div>
          ) : (
            <div className="h-[360px] w-full flex justify-center items-center">
              <FaCamera className="text-9xl text-neutral-200" />
            </div>
          )}
        </>
      ) : (
        <div className="h-[360px] w-full flex justify-center items-center">
          <video ref={videoRef} autoPlay />
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      <div className="flex justify-center gap-4 mt-4">
        {!isCameraOpen && !imageSrc && (
          <Button
            loading={loading}
            className=""
            type="primary"
            onClick={openCamera}
            icon={<FaCamera />}
          >
            Open Camera
          </Button>
        )}

        {isCameraOpen && (
          <Button
            loading={loading}
            className=""
            type="primary"
            onClick={captureSelfie}
            icon={<FaCheck />}
          >
            Capture
          </Button>
        )}

        {imageSrc && (
          <Button
            loading={loading}
            className=""
            type="primary"
            onClick={handleSave}
            icon={<FaSave />}
          >
            Save
          </Button>
        )}

        {(imageSrc || isImageUploaded) && (
          <Button
            className=""
            type="default"
            onClick={resetCamera}
            icon={<FaRedo />}
          >
            Reset Camera
          </Button>
        )}
      </div>
    </div>
  );
};

export default UploadSelfie;
