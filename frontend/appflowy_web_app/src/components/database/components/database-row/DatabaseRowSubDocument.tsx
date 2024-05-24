import { YDoc } from '@/application/collab.type';
import { useRowMetaSelector } from '@/application/database-yjs';
import { useId } from '@/components/_shared/context-provider/IdProvider';
import { AFConfigContext } from '@/components/app/AppConfig';
import { Editor } from '@/components/editor';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useCallback, useContext, useEffect, useState } from 'react';

export function DatabaseRowSubDocument({ rowId }: { rowId: string }) {
  const { workspaceId } = useId() || {};
  const meta = useRowMetaSelector(rowId);
  const documentId = meta?.documentId;

  console.log('documentId', documentId);
  const [loading, setLoading] = useState(true);
  const [doc, setDoc] = useState<YDoc | null>(null);

  const documentService = useContext(AFConfigContext)?.service?.documentService;

  const handleOpenDocument = useCallback(async () => {
    if (!documentService || !workspaceId || !documentId) return;
    try {
      setDoc(null);
      const doc = await documentService.openDocument(workspaceId, documentId);

      console.log('doc', doc);
      setDoc(doc);
    } catch (e) {
      console.error(e);
      // haven't created by client, ignore error and show empty
    }
  }, [documentService, workspaceId, documentId]);

  useEffect(() => {
    setLoading(true);
    void handleOpenDocument().then(() => setLoading(false));
  }, [handleOpenDocument]);

  if (loading) {
    return (
      <div className={'flex h-[260px] w-full items-center justify-center'}>
        <CircularProgress />
      </div>
    );
  }

  if (!doc) return null;

  return <Editor doc={doc} readOnly={true} includeRoot={false} />;
}

export default DatabaseRowSubDocument;
