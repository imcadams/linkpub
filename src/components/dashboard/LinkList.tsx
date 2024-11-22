'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Link {
  id: number;
  title: string;
  url: string;
  position: number;
  clicks: number;
}

interface LinkListProps {
  links: Link[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number) => void;
  onReorder: (linkIds: number[]) => Promise<void>;
}

export default function LinkList({
  links,
  onDelete,
  onEdit,
  onReorder,
}: LinkListProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items.map(item => item.id));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="links">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {links.map((link, index) => (
              <Draggable
                key={link.id}
                draggableId={link.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-medium">{link.title}</h3>
                      <p className="text-sm text-gray-500">{link.url}</p>
                      <p className="text-xs text-gray-400">{link.clicks} clicks</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(link.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(link.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
