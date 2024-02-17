export default function Loader() {
  return (
    <>
      <div className="px-5 min-h-screen flex justify-content-center align-items-center">
        <div className="z-1 text-center">
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
          <p className="line-height-3 mt-0 mb-5 text-700 text-sm font-medium">
            Chargement en cours...
          </p>
        </div>
      </div>
    </>
  );
}
