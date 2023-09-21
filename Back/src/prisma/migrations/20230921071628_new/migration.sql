-- CreateTable
CREATE TABLE "_mutedList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_mutedList_AB_unique" ON "_mutedList"("A", "B");

-- CreateIndex
CREATE INDEX "_mutedList_B_index" ON "_mutedList"("B");

-- AddForeignKey
ALTER TABLE "_mutedList" ADD CONSTRAINT "_mutedList_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mutedList" ADD CONSTRAINT "_mutedList_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
