// app/quiz/components/DragDropQuestion.js
"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useTheme } from 'next-themes';

type DragDropQuestionProps = {
  id: string;
  options: string[];
  savedOrder: string[];
  onAnswer: (newOrder: string[]) => void;
};
export default function DragDropQuestion({
  id,
  options,
  savedOrder,
  onAnswer,
}: DragDropQuestionProps) {
  const { resolvedTheme } = useTheme();


  const handleDragEnd = (result:any) => {
    if (!result.destination) return;

    const items = Array.from(savedOrder);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    onAnswer(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={`q-${id}`}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {savedOrder.map((opt, index) => (
              <Draggable key={opt} draggableId={opt} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      padding: "8px",
                      margin: "4px 0",
                      background: `${resolvedTheme == "dark" ? "#1e2d4f" : "#cce4ff"}`,
                      borderRadius: "4px",
                ...provided.draggableProps.style
                    }}
                  >
                {opt}
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
        )}
    </Droppable>
    </DragDropContext >
  );
}
