"use client";

interface TabFilterProps {
  tagAndCounts: Record<string, number>;
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export default function TabFilter({
  tagAndCounts,
  selectedTag,
  onTagSelect,
}: TabFilterProps) {
  return (
    <ul className="tree-view">
      <Item onClick={() => onTagSelect(null)} isSelected={selectedTag === null}>
        포스트
      </Item>
      <ul>
        {Object.keys(tagAndCounts).map((tagName) => (
          <Item
            key={tagName}
            onClick={() => onTagSelect(tagName)}
            isSelected={selectedTag === tagName}
            firstLetterEmphasis
          >
            {`${tagName} (${tagAndCounts[tagName]})`}
          </Item>
        ))}
      </ul>
    </ul>
  );
}

const Item = ({
  onClick,
  children,
  isSelected,
  firstLetterEmphasis = false,
}: {
  onClick: () => void;
  children: string;
  isSelected: boolean;
  firstLetterEmphasis?: boolean;
}) => {
  return (
    <li
      onClick={onClick}
      className={`px-1 py-0.5 cursor-pointer ${
        isSelected
          ? "bg-[#010088] text-white border border-dotted border-white"
          : "bg-transparent border border-transparent"
      }`}
    >
      {firstLetterEmphasis ? (
        <>
          <span className="underline px-0.25">
            {children.charAt(0).toUpperCase()}
          </span>

          {children.slice(1)}
        </>
      ) : (
        children
      )}
    </li>
  );
};
