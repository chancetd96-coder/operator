type MissionInputProps = {
  mission: string;
  loading: boolean;
  onMissionChange: (value: string) => void;
  onBuild: () => void;
};

export default function MissionInput({
  mission,
  loading,
  onMissionChange,
  onBuild,
}: MissionInputProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <textarea
        value={mission}
        onChange={(event) => onMissionChange(event.target.value)}
        className="h-28 w-full resize-none rounded-xl bg-black/60 p-4 text-white outline-none placeholder:text-white/30"
        placeholder="Example: Launch a mobile detailing business in Savannah with $2,000 and weekends only"
      />

      <button
        onClick={onBuild}
        disabled={loading || !mission.trim()}
        className="mt-3 w-full rounded-xl bg-white px-5 py-4 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Building mission dashboard..." : "Build Mission Dashboard"}
      </button>
    </div>
  );
}